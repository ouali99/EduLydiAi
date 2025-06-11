import { NextResponse } from "next/server";
import { courseOutlineIAModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_TABLE, USER_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { eq, count } from "drizzle-orm";

export async function POST(req) {
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

    try {
        // 1. Rechercher l'utilisateur
        const user = await db
            .select()
            .from(USER_TABLE)
            .where(eq(USER_TABLE.email, createdBy))
            .limit(1);

        if (!user || user.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userRecord = user[0];

        // 2. Compter les cours créés par cet utilisateur - CORRECTION ICI
        const courseCount = await db
            .select({ count: count() })
            .from(STUDY_TABLE)
            .where(eq(STUDY_TABLE.createdBy, createdBy));

        const coursesCreated = courseCount[0]?.count ?? 0;

        // 3. Vérification des crédits pour Free tier
        if (userRecord.subscriptionTier === "Free" && coursesCreated >= 5) {
            return NextResponse.json(
                { error: "Credit limit reached. Please upgrade to create more courses." },
                { status: 403 }
            );
        }

        // 4. Limitation du niveau de difficulté
        if (userRecord.subscriptionTier === "Free" && difficultyLevel !== "Easy") {
            return NextResponse.json(
                { error: "Free users can only create courses with 'Easy' difficulty. Please upgrade to access all difficulty levels." },
                { status: 403 }
            );
        }

        // 5. Génération du cours avec l'IA
        const prompt = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with the summary of course, list of Chapters along with summary and Emoji for each chapter, Topic list in each chapter. All results in JSON format.`;

        const aiResponse = await courseOutlineIAModel.sendMessage(prompt);
        const aiText = await aiResponse.response.text();
        console.log("AI Text Response:", aiText);

        const aiResult = JSON.parse(aiText);

        // 6. Insertion du cours dans la base
        const dbResult = await db
            .insert(STUDY_TABLE)
            .values({
                courseId,
                courseType,
                createdBy,
                topic,
                difficultyLevel,
                courseLayout: aiResult,
            })
            .returning({ resp: STUDY_TABLE });

        // 7. Mise à jour des crédits
        const currentCreditsUsed = userRecord.creditsUsed || 0;
        await db
            .update(USER_TABLE)
            .set({
                creditsUsed: currentCreditsUsed + 1,
            })
            .where(eq(USER_TABLE.id, userRecord.id));

        // 8. Déclenchement de la fonction Inngest
        const result = await inngest.send({
            name: 'notes.generate',
            data: {
                course: dbResult[0].resp,
            },
        });

        console.log("Inngest triggered:", result);

        return NextResponse.json({ result: dbResult[0] });
    } catch (error) {
        console.error("Error generating course:", error);
        return NextResponse.json({ error: "Failed to generate course" }, { status: 500 });
    }
}