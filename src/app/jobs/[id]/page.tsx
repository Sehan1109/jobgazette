// src/app/jobs/[id]/page.tsx
import connectDB from "../../lib/db";
import Job from "../../models/Job";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Wallet, Share2, ExternalLink } from "lucide-react";

// Data Fetching directly from DB (Server Component)
async function getJob(id: string) {
    try {
        await connectDB();
        const job = await Job.findById(id).lean();
        if (!job) return null;

        // Serialize MongoDB ID and Dates
        return {
            ...job,
            _id: job._id.toString(),
            createdAt: job.createdAt.toISOString(),
            updatedAt: job.updatedAt.toISOString(),
        };
    } catch (error) {
        return null;
    }
}

export default async function JobDetails({ params }: { params: { id: string } }) {
    const job: any = await getJob(params.id);

    if (!job) {
        notFound();
    }

    // Google Jobs SEO Schema (Structured Data)
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "datePosted": job.createdAt,
        "validThrough": "2025-12-31", // කැමති නම් වෙනස් කරන්න පුළුවන්
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.companyName,
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressCountry": "LK",
            },
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "LKR",
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salaryRange || "Negotiable",
                "unitText": "MONTH"
            }
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 flex justify-center">
            {/* Inject SEO Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden shadow-2xl relative">

                {/* Background Blur Element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] -z-10">

                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-dark-800 to-dark-900 p-8 md:p-12 relative overflow-hidden">
                        {/* Neon Lines BG */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue/20 via-transparent to-transparent"></div>

                        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-blue transition mb-8">
                            <ArrowLeft size={20} /> Back to Jobs
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 text-glow">{job.title}</h1>

                        <div className="flex flex-wrap gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-lg text-neon-blue border-neon-blue/20">
                                <Building2 size={18} /> <span>{job.companyName}</span>
                            </div>
                            <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-lg text-gray-300">
                                <MapPin size={18} /> <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-lg text-green-400">
                                <Wallet size={18} /> <span>{job.salaryRange || "Negotiable"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        <div className="mb-10">
                            <h3 className="text-2xl font-heading font-bold text-white mb-6 border-b border-white/10 pb-4">Job Description</h3>
                            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed font-body text-lg opacity-90">
                                {job.description}
                            </div>
                        </div>

                        {/* Futuristic Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t border-white/10">
                            {/* Apply Button - Neon Gradient */}
                            <a
                                href={job.applicationLink.includes('http') ? job.applicationLink : `tel:${job.applicationLink}`}
                                target="_blank"
                                className="flex-1 relative group overflow-hidden bg-gradient-to-r from-neon-blue to-blue-600 p-px rounded-xl font-bold text-lg shadow-neon-blue transition-all hover:scale-[1.02]"
                            >
                                <div className="relative bg-dark-900/90 h-full w-full rounded-xl p-4 flex items-center justify-center gap-3 text-white group-hover:bg-transparent transition-all duration-300">
                                    Apply Now <ExternalLink size={20} />
                                </div>
                            </a>

                            {/* WhatsApp Share Button - Green Glow */}
                            <a
                                href={`https://wa.me/?text=Check out this job: ${job.title} at ${job.companyName} - https://jobgazette.lk/jobs/${job._id}`}
                                target="_blank"
                                className="flex-1 bg-dark-800 border border-green-500/30 hover:border-green-500 hover:shadow-neon-green text-green-400 hover:text-white p-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] flex justify-center items-center gap-3"
                            >
                                Share on WhatsApp <Share2 size={20} />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}