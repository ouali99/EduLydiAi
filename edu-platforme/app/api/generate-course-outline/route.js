import { NextResponse } from "next/server";
import { courseOutlineIAModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_TABLE } from "@/configs/schema";

export async function POST(req) {
    const { courseId, topic, courseType, difficultyLevel, createdBy} = await req.json();

    const PROMPT = 'Generate a study material for '+topic+' for '+courseType+' and level of difficulty  will be '+difficultyLevel+' with the summery of course, list of Chapters along with summery for each chapter, Topic list in each chapter, All results in  JSON format'
    // Generate course layout using IA
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
    }).returning({ STUDY_TABLE });
    console.log(dbResult);
    return NextResponse.json({ result: dbResult[0] });
}