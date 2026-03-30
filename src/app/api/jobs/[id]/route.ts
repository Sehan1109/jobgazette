import connectDB from "../../../lib/db";
import Job from "../../../models/Job";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: any // ✅ IMPORTANT: let Next.js handle types
) {
    try {
        await connectDB();

        const { id } = await context.params;
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