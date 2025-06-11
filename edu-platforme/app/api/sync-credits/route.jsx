// app/api/sync-credits/route.js
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { USER_TABLE, STUDY_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST() {
    try {
        // Récupérer tous les utilisateurs
        const users = await db.select().from(USER_TABLE);
        
        const updates = [];
        
        for (const user of users) {
            // Compter le nombre réel de cours pour chaque utilisateur
            const courseCount = await db
                .select({ count: db.fn.count() })
                .from(STUDY_TABLE)
                .where(eq(STUDY_TABLE.createdBy, user.email));
                
            const actualCoursesCreated = parseInt(courseCount[0].count) || 0;
            
            // Mettre à jour creditsUsed si différent
            if (user.creditsUsed !== actualCoursesCreated) {
                await db
                    .update(USER_TABLE)
                    .set({
                        creditsUsed: actualCoursesCreated
                    })
                    .where(eq(USER_TABLE.id, user.id));
                    
                updates.push({
                    userId: user.id,
                    email: user.email,
                    oldCreditsUsed: user.creditsUsed,
                    newCreditsUsed: actualCoursesCreated
                });
            }
        }
        
        return NextResponse.json({
            message: `Synchronized credits for ${updates.length} users`,
            updates: updates
        });
        
    } catch (error) {
        console.error("Error syncing credits:", error);
        return NextResponse.json(
            { error: "Failed to sync credits" },
            { status: 500 }
        );
    }
}