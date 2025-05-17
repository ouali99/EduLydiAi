import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.clerkId, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userRecord = user[0];

    // If user doesn't have a subscription, return basic info
    if (!userRecord.stripeSubscriptionId) {
      return NextResponse.json({
        subscription: null,
        plan: "Free",
        credits: 5,
        creditsUsed: userRecord.creditsUsed || 0,
        status: "active"
      });
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(userRecord.stripeSubscriptionId);
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);

    // Calculate credits based on plan
    let totalCredits = 5; // Default for free plan
    if (product.name === "Pro") {
      totalCredits = 999999; // Unlimited
    } else if (product.name === "Teams") {
      totalCredits = 999999; // Unlimited
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      },
      plan: product.name,
      credits: totalCredits,
      creditsUsed: userRecord.creditsUsed || 0,
      status: subscription.status
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}