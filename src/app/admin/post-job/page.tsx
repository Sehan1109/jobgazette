// src/app/admin/post-job/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJob() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        companyName: "",
        location: "",
        description: "",
        salaryRange: "",
        jobType: "Full-time",
        applicationLink: "", // Phone number or URL
        secretPin: "" // Security check
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // පොඩි ආරක්ෂාවක් (මේක පස්සේ වෙනස් කරගන්න)
        if (formData.secretPin !== "1234") {
            alert("Incorrect PIN!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Job Posted Successfully!");
                router.push("/"); // Home page එකට යන්න
            } else {
                alert("Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            alert("Error posting job");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">Post a New Job 📝</h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required name="title" placeholder="Job Title (e.g. Driver)" onChange={handleChange} className="border p-3 rounded-lg w-full" />
                        <input required name="companyName" placeholder="Company Name" onChange={handleChange} className="border p-3 rounded-lg w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required name="location" placeholder="Location (e.g. Colombo)" onChange={handleChange} className="border p-3 rounded-lg w-full" />
                        <select name="jobType" onChange={handleChange} className="border p-3 rounded-lg w-full">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Gazette">Government Gazette</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    <input name="salaryRange" placeholder="Salary (e.g. Rs. 50,000 - 60,000)" onChange={handleChange} className="border p-3 rounded-lg w-full" />

                    <input required name="applicationLink" placeholder="Phone Number or Apply Link" onChange={handleChange} className="border p-3 rounded-lg w-full" />

                    <textarea required name="description" placeholder="Job Description..." rows={5} onChange={handleChange} className="border p-3 rounded-lg w-full" />

                    {/* Security PIN Field */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <label className="block text-sm font-medium text-yellow-800 mb-1">Admin Security PIN</label>
                        <input required type="password" name="secretPin" placeholder="Enter PIN (1234)" onChange={handleChange} className="border p-3 rounded-lg w-full" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? "Posting..." : "Post Job Now"}
                    </button>
                </form>
            </div>
        </div>
    );
}