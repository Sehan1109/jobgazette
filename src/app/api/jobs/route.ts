// src/app/api/jobs/route.ts
import connectDB from "../../lib/db";
import Job from "../../models/Job";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// 1. GET Request - Jobs ඔක්කොම පෙන්නන්න
export async function GET() {
    try {
        await connectDB();
        // අලුත්ම Jobs උඩින්ම එන්න (sort by createdAt descending)
        const jobs = await Job.find({}).sort({ createdAt: -1 });
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

// 2. POST Request - අලුත් Job එකක් Save කරන්න (Admin only)
export async function POST(req: Request) {
    const session = await getServerSession();

    // Login වෙලා නැත්නම් Job දාන්න බෑ
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    // Job එකට User ID එක (Email එක) එකතු කරනවා
    await Job.create({ ...data, postedBy: session.user.email });

    return NextResponse.json({ message: "Job Posted!" }, { status: 201 });
}

export async function DELETE(req: Request) {
    const session: any = await getServerSession(); // Session එක ගන්න

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await connectDB();

    const job = await Job.findById(id);
    if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });

    // Logic: Job එක දාපු කෙනාට හෝ Admin ට විතරයි Delete කරන්න පුළුවන්
    if (job.postedBy === session.user.email || session.user.role === 'admin') {
        await Job.findByIdAndDelete(id);
        return NextResponse.json({ message: "Job Deleted" });
    } else {
        return NextResponse.json({ message: "You can't delete this job!" }, { status: 403 });
    }
}