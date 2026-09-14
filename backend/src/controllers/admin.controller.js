// file banayi gyi taaki admin poora overview le sake admin panel ka 

import { User } from "../models/user.model.js";
import { ATSAnalysis } from "../models/atsAnalysis.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getPlatformStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalResumesAnalyzed = await ATSAnalysis.countDocuments();
    const avgScoreResult = await ATSAnalysis.aggregate([// array of stages leta hain 
       // aggreagate always retuen an array 
        {
            $group: {
                _id: null,// ek hi group mein daal rahe isiliye id null dedei 
                averageATSScore: { $avg: "$atsScore" },
            },
        },
    ]);

    const averageATSScore = avgScoreResult.length > 0
        ? Math.round(avgScoreResult[0].averageATSScore)// sirf ek hi cheez hain array mein andar
        : 0;// agar kuch na mile toh 
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalUsers,
                    totalResumesAnalyzed,
                    averageATSScore,
                },
                "Platform stats fetched successfully"
            )
        );
});

const getPlatformMissingSkillsTrend = asyncHandler(async (req, res) => {// ye sraaai jitne bhi resume analyze huye unme nikli missing skills ka common so sabse jayda hain us
// usse niklane ke liye hain ye bhi ek admint endpoint se hain woh sari missing skills mein se dikhenge 
    const allAnalyses = await ATSAnalysis.find({ missingSkills: { $exists: true, $ne: [] } });

    const allMissingSkills = allAnalyses.flatMap((analysis) => analysis.missingSkills);

    const skillFrequency = {};

    allMissingSkills.forEach((skill) => {
        const normalizedSkill = skill.trim().toLowerCase();
        skillFrequency[normalizedSkill] = (skillFrequency[normalizedSkill] || 0) + 1;
    });

    const trendingMissingSkills = Object.entries(skillFrequency)
    //object.entries-- ye object jko array ke pair mein convert kargi like [docker,15 ]--> missing skills itn elogo ki 
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                trendingMissingSkills,
                "Platform missing skills trend fetched successfully"
            )
        );
});

export { getPlatformStats, getPlatformMissingSkillsTrend };
