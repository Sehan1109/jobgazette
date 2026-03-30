// src/app/api/jobs/[id]/route.ts
import connectDB from "../../../lib/db";
import Job from "../../../models/Job";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// තනි Job එකක් ID එකෙන් හොයන්න
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { id } = params; // ❌ await නැතුව
        const job = await Job.findById(id);

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}