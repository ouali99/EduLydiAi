import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        // Récupérer l'authentification via Clerk - ne pas dépendre du token dans l'en-tête
        const { userId } = auth();
        
        // Si l'utilisateur n'est pas authentifié, retourner des données par défaut
        if (!userId) {
            return NextResponse.json({
                plan: 'Free',
                credits: 5,
                creditsUsed: 0,
                status: 'active'
            });
        }
        
        // Récupérer les informations d'utilisateur
        const users = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.clerkId, userId));
            
        // Si l'utilisateur n'est pas trouvé dans la base de données
        if (users.length === 0) {
            return NextResponse.json({
                plan: 'Free',
                credits: 5,
                creditsUsed: 0,
                status: 'active'
            });
        }
        
        const user = users[0];
        
        // Mapper les données de l'utilisateur au format attendu par le frontend
        return NextResponse.json({
            plan: user.subscriptionTier || 'Free',
            credits: user.subscriptionTier === 'Pro' ? 10000 : 5,
            creditsUsed: user.creditsUsed || 0,
            status: user.isMember ? 'active' : 'inactive'
        });
        
    } catch (error) {
        console.error("Error fetching subscription:", error);
        
        // En cas d'erreur, retourner des données par défaut
        return NextResponse.json({
            plan: 'Free',
            credits: 5,
            creditsUsed: 0,
            status: 'active'
        });
    }
}