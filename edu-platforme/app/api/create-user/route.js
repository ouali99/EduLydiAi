import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const { user } = await req.json();
        
        if (!user || !user.primaryEmailAddress) {
            return NextResponse.json(
                { error: "Invalid user data - missing email" }, 
                { status: 400 }
            );
        }

        if (!user.clerkId) {
            return NextResponse.json(
                { error: "Invalid user data - missing clerkId" }, 
                { status: 400 }
            );
        }

        console.log('Processing user:', user);

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.email, user.primaryEmailAddress))
            .limit(1);
        
        let result;
        
        if (existingUser.length === 0) {
            // Créer un nouvel utilisateur
            const userData = {
                name: user.fullName || 'User',
                email: user.primaryEmailAddress,
                clerkId: user.clerkId,
                isMember: false,
                creditsUsed: 0,
                subscriptionTier: 'Free'
            };

            result = await db
                .insert(USER_TABLE)
                .values(userData)
                .returning({ id: USER_TABLE.id });
                
            console.log('New user created:', result[0]);
                
            // Envoyer l'événement à Inngest avec des données correctes
            try {
                await inngest.send({
                    name: 'user.create',
                    data: {
                        user: {
                            id: result[0].id,
                            name: user.fullName || 'User', // S'assurer que name n'est pas null
                            fullName: user.fullName || 'User',
                            email: user.primaryEmailAddress,
                            clerkId: user.clerkId
                        }
                    }
                });
                console.log('Inngest event sent successfully');
            } catch (inngestError) {
                console.error('Inngest error:', inngestError);
                // Ne pas faire échouer la création d'utilisateur pour une erreur Inngest
            }
        } else {
            // Mettre à jour l'utilisateur existant avec le clerkId si nécessaire
            if (user.clerkId && (!existingUser[0].clerkId || existingUser[0].clerkId !== user.clerkId)) {
                result = await db
                    .update(USER_TABLE)
                    .set({
                        clerkId: user.clerkId,
                        name: user.fullName || existingUser[0].name || 'User'
                    })
                    .where(eq(USER_TABLE.email, user.primaryEmailAddress))
                    .returning({ id: USER_TABLE.id });
                    
                console.log('User updated:', result[0]);
            } else {
                result = [{ id: existingUser[0].id }];
                console.log('User already exists:', result[0]);
            }
        }
        
        return NextResponse.json({ 
            success: true,
            id: result[0].id,
            message: existingUser.length === 0 ? 'User created' : 'User updated'
        });
        
    } catch (error) {
        console.error("Error in create-user API:", error);
        
        // Vérifier si c'est une erreur de base de données
        if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
            return NextResponse.json(
                { error: "Database schema error - please check your database setup" }, 
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to create/update user", details: error.message }, 
            { status: 500 }
        );
    }
}