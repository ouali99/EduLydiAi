// app/api/create-checkout-session/route.js (changez .jsx en .js)
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

// Vérifier que la clé Stripe est présente
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY n'est pas défini dans les variables d'environnement");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { userId } = auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { priceId, email } = await req.json();
        
        if (!priceId || !email) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Pour l'instant, utiliser des prix fixes ou créer des prix de test
        const stripePriceId = getStripePriceId(priceId);
        
        if (!stripePriceId) {
            return NextResponse.json(
                { error: "Invalid price ID" },
                { status: 400 }
            );
        }

        // Créer ou récupérer le client Stripe
        let customer;
        const existingCustomers = await stripe.customers.list({ 
            email,
            limit: 1 
        });
        
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({ 
                email,
                metadata: {
                    clerkUserId: userId
                }
            });
        }

        // Créer la session de checkout
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
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'}/dashboard/upgrade?canceled=true`,
            metadata: {
                email,
                clerkUserId: userId
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session: " + error.message },
            { status: 500 }
        );
    }
}

// Fonction helper pour mapper les prix
function getStripePriceId(internalPriceId) {
    // Pour le développement, créez des prix de test dans Stripe
    // et remplacez ces valeurs par vos vrais prix IDs
    const priceMap = {
        price_pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_test_pro_monthly",
        price_pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_test_pro_annual", 
        price_teams_monthly: process.env.STRIPE_PRICE_TEAMS_MONTHLY || "price_test_teams_monthly",
        price_teams_annual: process.env.STRIPE_PRICE_TEAMS_ANNUAL || "price_test_teams_annual",
    };

    return priceMap[internalPriceId];
}