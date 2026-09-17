import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchJobs } from "../services/jobService.js";
import { extractSkillsForMultipleJobs } from "../utils/skillExtractor.js";
import { getMarketSkillDemand } from "../services/marketAnalysis.service.js";
import { matchResumeWithJobs } from "../services/skillMatching.service.js";


const searchJobs = asyncHandler(async (req, res) => {

    const { role, location } = req.query;
    // 3rd way of fetching?
    // ?role=React Developer&location=Delhi
    // aage aise milega so query.role

    if (!role) {
        throw new ApiError(400, "Job role is required");
    }

    const jobs = await fetchJobs(role, location);

    // Abhi maximum 5 jobs process karenge
    const jobsToProcess = jobs.slice(0, 5);

    // Pehle 5 jobs ke liye 5 Gemini API calls ho rahi thi.
    // Ab saari jobs ko ek saath bhejkar sirf 1 Gemini API call karenge.
    const extractedSkills = await extractSkillsForMultipleJobs(jobsToProcess);

    const jobsWithSkills = jobsToProcess.map((job) => {

        // Gemini ke response mein same externalJobId wali skills find kar rahe hain
        const skillData = extractedSkills.find(
            (item) => item.externalJobId === job.externalJobId
        );

        return {
            ...job,
            requiredSkills: skillData?.skills || [],
        };
    });


    // MongoDB mein duplicate jobs save hone se rokne ke liye
    for (const job of jobsWithSkills) {

        const existingJob = await Job.findOne({
            externalJobId: job.externalJobId,
        });

        if (existingJob) {
            continue;
        }

        await Job.create(job);
        // saving in MongoDB
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

    const marketDemand = await getMarketSkillDemand();
    // service function ko call kiya hain

    if (!marketDemand || marketDemand.length === 0) {
        // no data
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

    const { targetRole } = req.query;
    // user jo role choose karega, wo yahan se aayega

    const result = await matchResumeWithJobs(
        req.user._id,
        targetRole
    );

    if (!result) {
        throw new ApiError(
            404,
            "No resume analysis found. Please analyze your resume first."
        );
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


export {
    searchJobs,
    marketSkillAnalysis,
    matchJobs
};