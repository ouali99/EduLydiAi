import { NextResponse } from "next/server";
import { courseOutlineIAModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";

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
    }).returning({ resp:STUDY_TABLE });

    // trigger the Inggrest function to generate chapter notes
    const result = await inngest.send({
        name: 'notes.generate',
        data: {
            course: dbResult[0].resp
        }
    })
    console.log(result);
    return NextResponse.json({ result: dbResult[0] });
}