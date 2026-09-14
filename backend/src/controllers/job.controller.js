import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchJobs } from "../services/jobService.js";
import { extractJobSkills } from "../utils/skillExtractor.js";
import { getMarketSkillDemand } from "../services/marketAnalysis.service.js";
import { matchResumeWithJobs } from "../services/skillMatching.service.js";

const searchJobs = asyncHandler(async (req, res) => {

    const { role, location } = req.query;// 3rd way of fetcing?role=React Developer&location=Delhi aage ais emilega so query.role

    if (!role) {
        throw new ApiError(400, "Job role is required");
    }
    const jobs = await fetchJobs(role, location);
    const jobsWithSkills = [];
    const jobsToProcess = jobs.slice(0, 5);

    for (const job of jobsToProcess) {
    
        const skills = await extractJobSkills(job.description);
    
        jobsWithSkills.push({
            ...job,
            requiredSkills: skills,
        });
    
    }
    for (const job of jobsWithSkills){
        const existingJob = await Job.findOne({// for duplicacy 
            externalJobId: job.externalJobId,
        });
        if (existingJob) {
            continue;
        }await Job.create(job);// saveing in mongodb 
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            jobsWithSkills,
            "Jobs fetched successfully"
        )
    );
});

const marketSkillAnalysis = asyncHandler(async (req, res) => {
    const marketDemand = await getMarketSkillDemand();//service function ko call kiya hain

    if (!marketDemand || marketDemand.length === 0) {//no data 
        throw new ApiError(404, "No market data available yet.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            marketDemand,
            "Market skill demand fetched successfully"
        )
    );
});

const matchJobs = asyncHandler(async (req, res) => {
    const { targetRole } = req.query; // user jo role choose karega, wo yahan se aayega

    const result = await matchResumeWithJobs(req.user._id, targetRole);

    if (!result) {
        throw new ApiError(404, "No resume analysis found. Please analyze your resume first.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Job matches calculated successfully"
            )
        );
});

export { searchJobs,marketSkillAnalysis,matchJobs };