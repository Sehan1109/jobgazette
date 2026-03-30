// src/app/page.tsx
import connectDB from "../app/lib/db";
import Job from "../app/models/Job";
import JobFeed from "../components/JobFeed";

// Data Fetching (Server Side)
async function getJobs() {
  try {
    await connectDB();
    const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();

    return jobs.map((job: any) => ({
      ...job,
      _id: job._id.toString(),
      postedAt: job.createdAt ? job.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen bg-futuristic-bg relative overflow-hidden">

      {/* Background Grid Pattern (Visual Effect) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">

        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] -z-10"></div>

          <span className="inline-block mt-10 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-neon-blue text-sm font-bold mb-4 animate-pulse">
            🚀  #1 Job Aggregator in Sri Lanka
          </span>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-blue to-neon-purple leading-tight">
            Next-Gen Jobs <br /> for Sri Lanka
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-body mb-8">
            Government Gazettes & Private Vacancies in one modern platform.
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 md:gap-16 border-t border-white/5 pt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{jobs.length}+</div>
              <div className="text-sm text-gray-500">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-500">Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Free</div>
              <div className="text-sm text-gray-500">For Everyone</div>
            </div>
          </div>
        </div>

        {/* Client Side Job Feed (Search & List) */}
        <JobFeed initialJobs={jobs} />

      </div>
    </main>
  );
}