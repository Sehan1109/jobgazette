// src/app/api/jobs/[id]/route.ts
import connectDB from "../../../lib/db";
import Job from "../../../models/Job";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params; // ✅ MUST await
        const job = await Job.findById(id);

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}