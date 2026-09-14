import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roadmap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roadmap",
            required: true,
        },
        weeksProgress: [
            {
                weekNumber: {
                    type: Number,
                    required: true,
                },
                resourcesCompleted: {
                    type: [Boolean],
                    default: [],
                },
                projectCompleted: {
                    type: Boolean,
                    default: false,
                },
                leetcodeTopicsCompleted: {
                    type: [Boolean],
                    default: [],
                },
            },
        ],
        currentStreak: {
            type: Number,
            default: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
        },
        lastActivityDate: {
            type: Date,
            default: null,
        },
        badges: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

export const Progress = mongoose.model("Progress", progressSchema);