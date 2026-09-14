import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        owner: {// means user ki id store karenge 
            type: mongoose.Schema.Types.ObjectId,//mongodb id
            ref: "User",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        extractedText: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const Resume = mongoose.model("Resume", resumeSchema);