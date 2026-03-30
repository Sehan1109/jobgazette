// src/components/JobFeed.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, Clock, Briefcase, Search, Filter } from "lucide-react";

// Job Type Colors
const getJobTypeColor = (type: string) => {
    switch (type) {
        case "Gazette": return "text-neon-pink border-neon-pink/30 bg-neon-pink/10 shadow-[0_0_10px_rgba(255,0,200,0.2)]";
        case "Part-time": return "text-orange-400 border-orange-400/30 bg-orange-400/10";
        default: return "text-neon-blue border-neon-blue/30 bg-neon-blue/10 shadow-[0_0_10px_rgba(0,247,255,0.2)]";
    }
};

export default function JobFeed({ initialJobs }: { initialJobs: any[] }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    // Filter Logic
    const filteredJobs = initialJobs.filter((job) => {
        const matchTitle = job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.companyName.toLowerCase().includes(search.toLowerCase());
        const matchType = filter === "All" ? true : job.jobType === filter;
        return matchTitle && matchType;
    });

    return (
        <div className="max-w-4xl mx-auto">

            {/* Search & Filter Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 space-y-4"
            >
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-neon-blue transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Job Title or Company..."
                        className="w-full pl-12 pr-4 py-4 bg-dark-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all backdrop-blur-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {['All', 'Full-time', 'Gazette', 'Part-time', 'Contract'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filter === type
                                    ? "bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,247,255,0.3)]"
                                    : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Job List with Animations */}
            <div className="grid gap-6">
                <AnimatePresence>
                    {filteredJobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center p-12 glass-panel rounded-xl border border-white/10"
                        >
                            <p className="text-gray-400 text-lg">No jobs found matching your criteria.</p>
                            <button onClick={() => { setSearch(""); setFilter("All") }} className="mt-4 text-neon-blue hover:underline">Clear Filters</button>
                        </motion.div>
                    ) : (
                        filteredJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/jobs/${job._id}`}
                                    className="block glass-panel p-6 rounded-2xl transition-all duration-300 hover:border-neon-blue/50 hover:shadow-neon-blue group border border-white/5 bg-dark-800/50 backdrop-blur-md relative overflow-hidden"
                                >
                                    {/* Hover Gradient Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
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

                                    <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400 border-t border-white/10 pt-4 font-body relative z-10">
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
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}