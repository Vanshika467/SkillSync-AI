import { Roadmap } from "../models/roadmap.model.js";
import { matchResumeWithJobs } from "../services/skillMatching.service.js";
import { generateRoadmap } from "../services/roadmapGenerator.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Progress } from "../models/progress.model.js";

const createRoadmap = asyncHandler(async (req, res) => {
    const { targetRole } = req.query; // user jo role choose karega, wo yahan se aayega

    const matchResult = await matchResumeWithJobs(req.user._id, targetRole);
    // isme resuneskills plus matcheskills plus tiopmissing teeno hain 

    if (!matchResult) {
        throw new ApiError(404, "No resume analysis found. Please analyze your resume first.");
    }

    const { topMissingSkills } = matchResult;// only matchong skills nikal 

    if (!topMissingSkills || topMissingSkills.length === 0) {
        throw new ApiError(400, "No missing skills found to generate a roadmap.");
    }

    const weeks = await generateRoadmap(topMissingSkills);

    if (!weeks || weeks.length === 0) {
        throw new ApiError(500, "Failed to generate roadmap. Please try again.");
    }

    const missingSkillNames = topMissingSkills.map((item) => item.skill);

    const roadmap = await Roadmap.create({// daatbase mein save 
        owner: req.user._id,
        basedOnMissingSkills: missingSkillNames,
        weeks,
    });
    
    const initialWeeksProgress = weeks.map((week) => ({
        weekNumber: week.weekNumber,
        resourcesCompleted: week.resources.map(() => false),
        projectCompleted: false,
        leetcodeTopicsCompleted: week.leetcodeTopics.map(() => false),
    }));

    const progress = await Progress.create({
        owner: req.user._id,
        roadmap: roadmap._id,
        weeksProgress: initialWeeksProgress,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {roadmap,progress},
                "Roadmap and progress tracker created successfully"
            )
        );
});

const getMyRoadmap = asyncHandler(async (req, res) => {
    const roadmap = await Roadmap.findOne({ owner: req.user._id }).sort({ createdAt: -1 });

    if (!roadmap) {
        throw new ApiError(404, "No roadmap found. Please generate one first.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, roadmap, "Roadmap fetched successfully"));
});

export { createRoadmap, getMyRoadmap };