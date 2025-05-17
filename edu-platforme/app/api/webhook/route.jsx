import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object;
      // Update user's subscription status in the database
      await handleCheckoutSessionCompleted(checkoutSession);
      break;
    case "customer.subscription.updated":
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
    case "customer.subscription.deleted":
      const canceledSubscription = event.data.object;
      await handleSubscriptionCanceled(canceledSubscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session) {
  const customerEmail = session.metadata?.email;
  
  if (!customerEmail) {
    console.error("No customer email found in session metadata");
    return;
  }

  try {
    // Retrieve the subscription
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Get the product details
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
    
    // Update user in database
    await db
      .update(USER_TABLE)
      .set({
        isMember: true,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        subscriptionStatus: subscription.status,
        subscriptionTier: product.name, // e.g., "Pro", "Teams"
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(USER_TABLE.email, customerEmail));
    
    console.log(`Updated subscription for user ${customerEmail}`);
  } catch (error) {
    console.error("Error updating user subscription:", error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    // Find the customer in Stripe
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    // Get the product details
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);
    
    // Update the user in the database
    await db
      .update(USER_TABLE)
      .set({
        subscriptionStatus: subscription.status,
        subscriptionTier: product.name,
        subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(USER_TABLE.stripeCustomerId, subscription.customer));
    
    console.log(`Updated subscription for customer ${customer.email}`);
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
}

async function handleSubscriptionCanceled(subscription) {
  try {
    // Update the user in the database
    await db
      .update(USER_TABLE)
      .set({
        isMember: false,
        subscriptionStatus: "canceled",
        subscriptionTier: "Free",
      })
      .where(eq(USER_TABLE.stripeSubscriptionId, subscription.id));
    
    console.log(`Canceled subscription ${subscription.id}`);
  } catch (error) {
    console.error("Error canceling subscription:", error);
  }
}