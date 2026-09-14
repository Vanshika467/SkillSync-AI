import mongoose from "mongoose";

const atsAnalysisSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        required: true,
    },
    atsScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    sectionScore: {
        type: Number,
        default: 0,
    },
    keywordScore: {
        type: Number,
        default: 0,
    },
    contactScore: {
        type: Number,
        default: 0,
    },
    contentScore: {
        type: Number,
        default: 0,
    },
    missingSections: {
        type: [String],// array beacuse bahut sari cheeze missing ho skti hain 
        default: [],
    },
    suggestions: {
        type: [String],
        default: [],
    },
    matchedSkills: {
        type: [String],
        default: [],
    },
    
    missingSkills: {
        type: [String],
        default: [],
    },
    resumeSkills: {
        type: [String],
        default: [],
    },
    
    requiredSkills: {
        type: [String],
        default: [],
    },
},
{
    timestamps: true,
}
);

export const ATSAnalysis = mongoose.model(
"ATSAnalysis",
atsAnalysisSchema
);