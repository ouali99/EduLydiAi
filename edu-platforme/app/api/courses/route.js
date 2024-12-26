import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
    const {createdBy} = await req.json()
    const result = await db
        .select()
        .from(STUDY_TABLE)
        .where(eq(STUDY_TABLE.createdBy, createdBy))

    console.log(result);

    return NextResponse.json({result:result});
}