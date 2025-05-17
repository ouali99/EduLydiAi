import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { priceId, email } = await req.json();
    
    if (!priceId || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get the actual price IDs from Stripe
    const stripePriceId = getActualStripePriceId(priceId);
    
    // Get or create Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({ email });
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({ email });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?canceled=true`,
      metadata: {
        email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// Helper function to map our internal price IDs to actual Stripe price IDs
function getActualStripePriceId(internalPriceId) {
  const priceMap = {
    price_pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    price_pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
    price_teams_monthly: process.env.STRIPE_PRICE_TEAMS_MONTHLY,
    price_teams_annual: process.env.STRIPE_PRICE_TEAMS_ANNUAL,
  };

  return priceMap[internalPriceId] || internalPriceId;
}