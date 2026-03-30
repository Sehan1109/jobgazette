import connectDB from "../../../lib/db";
import Job from "../../../models/Job";

export async function GET(
    req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await ctx.params;

        const job = await Job.findById(id);

        if (!job) {
            return Response.json({ error: "Job not found" }, { status: 404 });
        }

        return Response.json(job);
    } catch (error) {
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}