import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    const { user } = await req.json();
    
    if (!user || !user.primaryEmailAddress) {
        return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    try {
        // Check if user exists
        const existingUser = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.email, user.primaryEmailAddress));
        
        let result;
        
        if (existingUser.length === 0) {
            // Create new user
            result = await db
                .insert(USER_TABLE)
                .values({
                    name: user.fullName,
                    email: user.primaryEmailAddress,
                    clerkId: user.clerkId,
                    isMember: false,
                    creditsUsed: 0,
                    subscriptionTier: 'Free'
                })
                .returning({ id: USER_TABLE.id });
                
            // Send event to Inngest for new user creation
            await inngest.send({
                name: 'user.create',
                data: {
                    user: {
                        id: result[0].id,
                        name: user.fullName,
                        email: user.primaryEmailAddress,
                        clerkId: user.clerkId
                    }
                }
            });
        } else {
            // Update existing user with clerk ID if needed
            if (user.clerkId && (!existingUser[0].clerkId || existingUser[0].clerkId !== user.clerkId)) {
                result = await db
                    .update(USER_TABLE)
                    .set({
                        clerkId: user.clerkId
                    })
                    .where(eq(USER_TABLE.email, user.primaryEmailAddress))
                    .returning({ id: USER_TABLE.id });
            } else {
                result = [{ id: existingUser[0].id }];
            }
        }
        
        return NextResponse.json({ id: result[0].id });
    } catch (error) {
        console.error("Error creating/updating user:", error);
        return NextResponse.json({ error: "Failed to create/update user" }, { status: 500 });
    }
}