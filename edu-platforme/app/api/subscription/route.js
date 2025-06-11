import { NextResponse } from "next/server";
import { courseOutlineIAModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_TABLE, USER_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { eq } from "drizzle-orm";

export async function POST(req) {
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

    // Check if user has credits available
    try {
        // Find user
        const user = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.email, createdBy))
            .limit(1);

        if (!user || user.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userRecord = user[0];
        
        // Get count of courses created by this user
        const courseCount = await db
            .select({ count: db.fn.count() })
            .from(STUDY_TABLE)
            .where(eq(STUDY_TABLE.createdBy, createdBy));
            
        const coursesCreated = parseInt(courseCount[0].count) || 0;
        
        // Check if user has available credits
        // Free users are limited to 5 courses
        if (userRecord.subscriptionTier === "Free" && coursesCreated >= 5) {
            return NextResponse.json(
                { error: "Credit limit reached. Please upgrade to create more courses." },
                { status: 403 }
            );
        }
        
        // If user is on free plan, check if they're trying to use advanced difficulty levels
        if (userRecord.subscriptionTier === "Free" && difficultyLevel !== "Easy") {
            return NextResponse.json(
                { error: "Free users can only create courses with 'Easy' difficulty. Please upgrade to access all difficulty levels." },
                { status: 403 }
            );
        }

        // Generate course with AI
        const PROMPT = 'Generate a study material for '+topic+' for '+courseType+' and level of difficulty  will be '+difficultyLevel+' with the summery of course, list of Chapters along with summary and Emoji for each chapter, Topic list in each chapter, All results in  JSON format'
        const aiResponse = await courseOutlineIAModel.sendMessage(PROMPT)
        const aiResult = JSON.parse(aiResponse.response.text())
        console.log("AI Response:", aiResponse.response.text());

        // Save course layout to DB
        const dbResult = await db.insert(STUDY_TABLE).values({
            courseId: courseId,
            courseType: courseType,
            createdBy: createdBy,
            topic: topic,
            courseLayout: aiResult,        
        }).returning({ resp:STUDY_TABLE });

        // Update user's credits used - FIX: s'assurer que creditsUsed n'est jamais null
        const currentCreditsUsed = userRecord.creditsUsed || 0;
        await db
            .update(USER_TABLE)
            .set({
                creditsUsed: currentCreditsUsed + 1
            })
            .where(eq(USER_TABLE.id, userRecord.id));

        // trigger the Inggrest function to generate chapter notes
        const result = await inngest.send({
            name: 'notes.generate',
            data: {
                course: dbResult[0].resp
            }
        })
        console.log(result);
        return NextResponse.json({ result: dbResult[0] });
    } catch (error) {
        console.error("Error generating course:", error);
        return NextResponse.json(
            { error: "Failed to generate course" },
            { status: 500 }
        );
    }
}