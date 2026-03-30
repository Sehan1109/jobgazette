import connectDB from "../../lib/db";
import Job from "../../models/Job";
import { getServerSession } from "next-auth";

// 1. GET Request - Jobs ඔක්කොම
export async function GET() {
    try {
        await connectDB();
        const jobs = await Job.find({}).sort({ createdAt: -1 });

        return Response.json(jobs);
    } catch (error) {
        return Response.json(
            { error: "Failed to fetch jobs" },
            { status: 500 }
        );
    }
}

// 2. POST Request - Add Job
export async function POST(req: Request) {
    const session = await getServerSession();

    if (!session || !session.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    await Job.create({ ...data, postedBy: session.user.email });

    return Response.json({ message: "Job Posted!" }, { status: 201 });
}

// 3. DELETE Request
export async function DELETE(req: Request) {
    const session: any = await getServerSession();

    if (!session || !session.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await connectDB();

    const job = await Job.findById(id);
    if (!job) {
        return Response.json({ message: "Job not found" }, { status: 404 });
    }

    if (job.postedBy === session.user.email || session.user.role === "admin") {
        await Job.findByIdAndDelete(id);
        return Response.json({ message: "Job Deleted" });
    } else {
        return Response.json(
            { message: "You can't delete this job!" },
            { status: 403 }
        );
    }
}