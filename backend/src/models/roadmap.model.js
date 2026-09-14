import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,//user docunt ki object id only id store hogi user se
            ref: "User",
            required: true,
        },
        basedOnMissingSkills: {
            type: [String],
            default: [],
        },
        weeks: [// this is array of objects 
            {
                weekNumber: {
                    type: Number,
                    required: true,
                },
                focusSkill: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    default: "",
                },
                resources: [
                    {
                        title: { type: String },
                        url: { type: String },
                    },
                ],
                practiceProject: {
                    type: String,
                    default: "",
                },
                leetcodeTopics: {
                    type: [String],
                    default: [],
                },
            },
        ],
    },
    { timestamps: true }
);

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);