import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        
        location: {
            type: String,
            default: "Not specified",
        },
        requiredSkills: {
            type: [String],
            default: [],
        },
        jobUrl: {//Later frontend me View Job / Apply button isi URL ko open kar sakta ha
            type: String,
            required: true,
        },
        
        source: {//means kaha se mili job 
            type: String,
            required: true,
        },
        externalJobId: {//avoid duplicates har baar alag job fetch hoke aye 
            type: String,
            required: true,
            unique: true,
        },
        postedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,//createdAt → job hamare database me kab save hui
        //updatedAt → job ka document last time kab update hua
    }
    );
    const Job = mongoose.model("Job", jobSchema);

export { Job };