// src/models/Job.ts
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    salaryRange: { type: String },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Gazette', 'Contract'],
        default: 'Full-time'
    },
    applicationLink: { type: String, required: true },
    tags: [String],
    postedAt: { type: Date, default: Date.now },
    postedBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);