// src/app/page.tsx
import Link from "next/link";
import connectDB from "../app/lib/db"; // Path එක හරිගස්සගන්න (@/lib/db හෝ ../lib/db)
import Job from "../app/models/Job";
import { MapPin, Building2, Clock, Briefcase } from "lucide-react";

// Data ගන්න Function එක (Server Side)
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

// Job Type එකට අනුව Neon පාට තෝරන හැටි
const getJobTypeColor = (type: string) => {
  switch (type) {
    case "Gazette": return "text-neon-pink border-neon-pink/30 bg-neon-pink/10 shadow-[0_0_10px_rgba(255,0,200,0.2)]";
    case "Part-time": return "text-orange-400 border-orange-400/30 bg-orange-400/10";
    default: return "text-neon-blue border-neon-blue/30 bg-neon-blue/10 shadow-[0_0_10px_rgba(0,247,255,0.2)]";
  }
};

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main className="min-h-screen container mx-auto px-4 py-12">

      <div className="absolute top-4 right-4 z-10">
        <Link href="/login" className="text-sm font-bold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-neon-blue hover:text-black transition">
          Login / Post Job
        </Link>
      </div>

      {/* Hero Section with Glowing Text */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] -z-10"></div>

        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-blue to-neon-purple leading-tight">
          Next-Gen Jobs <br /> for Sri Lanka
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto font-body">
          Discover government gazettes and private sector opportunities in a modern interface.
        </p>
      </div>

      {/* Job List Section */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        {jobs.length === 0 ? (
          <div className="text-center p-12 glass-panel rounded-xl border border-white/10">
            <p className="text-gray-400 text-lg">No jobs posted yet.</p>
            <p className="text-sm text-gray-600 mt-2">Check back later or post a job via Admin panel.</p>
          </div>
        ) : (
          jobs.map((job: any) => (
            <Link
              href={`/jobs/${job._id}`}
              key={job._id}
              className="block glass-panel p-6 rounded-2xl transition-all duration-300 hover:border-neon-blue/50 hover:shadow-neon-blue group border border-white/5 bg-dark-800/50 backdrop-blur-md"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-white group-hover:text-neon-blue transition-colors">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-400 mt-2 font-medium font-body">
                    <Building2 size={18} className="text-neon-purple" />
                    <p>{job.companyName}</p>
                  </div>
                </div>

                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getJobTypeColor(job.jobType)}`}>
                  {job.jobType}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400 border-t border-white/10 pt-4 font-body">
                <span className="flex items-center gap-2 hover:text-white transition">
                  <MapPin size={16} className="text-gray-500" /> {job.location}
                </span>
                <span className="flex items-center gap-2 hover:text-white transition">
                  <Briefcase size={16} className="text-gray-500" /> {job.salaryRange || "Negotiable"}
                </span>
                <span className="flex items-center gap-2 ml-auto text-xs opacity-60">
                  <Clock size={16} className="text-gray-500" /> {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}