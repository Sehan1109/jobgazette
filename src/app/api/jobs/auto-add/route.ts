import connectDB from '../../../lib/db';
import Job from '../../../models/Job';

export async function POST(req: Request) {
    try {
        // 1. Security check
        const authHeader = req.headers.get('authorization');
        const secretKey = process.env.MAKE_WEBHOOK_SECRET;

        if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
            return Response.json(
                { success: false, message: 'Unauthorized access!' },
                { status: 401 }
            );
        }

        // 2. Get request body
        const body = await req.json();

        const {
            title,
            companyName,
            location,
            description,
            applicationLink,
            salaryRange,
            jobType,
            tags,
            postedBy
        } = body;

        // 3. Validate required fields
        if (!title || !companyName || !location || !description || !applicationLink) {
            return Response.json(
                { success: false, message: 'Missing required fields!' },
                { status: 400 }
            );
        }

        // 4. Connect DB
        await connectDB();

        // 5. Save job
        const newJob = new Job({
            title,
            companyName,
            location,
            description,
            applicationLink,
            salaryRange: salaryRange || 'Negotiable',
            jobType: jobType || 'Full-time',
            tags: tags || [],
            postedBy: postedBy || 'Auto Bot (Make.com)',
        });

        const savedJob = await newJob.save();

        // 6. Success response
        return Response.json(
            {
                success: true,
                message: 'Job added successfully!',
                jobId: savedJob._id
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error adding auto job:', error);

        return Response.json(
            {
                success: false,
                message: 'Server Error',
                error: error.message
            },
            { status: 500 }
        );
    }
}