import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";
import { ATSAnalysis } from "../models/atsAnalysis.model.js";
import { analyzeATS } from "../utils/atsAnalyzer.js";
import { extractSkills } from "../utils/skillExtractor.js";
const analyzeResume = asyncHandler(async (req, res) => {

    const { resumeId } = req.params;
    //jd wala check yaha se start
    const { jobDescription } = req.body;

if (!jobDescription) {
    throw new ApiError(400, "Job description is required");
}

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }
    
    if (resume.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to analyze this resume");
    }
    const analysisResult = analyzeATS(resume.extractedText);

    const baseScore = analysisResult.baseScore;//ye poore se alag se basescore aagya
    const skills = await extractSkills(
        resume.extractedText,
        jobDescription
    );
    const matchedSkills = skills.requiredSkills.filter((skill) =>// doing cmaprison between resume and required skills skills mil chuki hain yaha tak hame
        skills.resumeSkills.some(
            (resumeSkill) =>
                resumeSkill.toLowerCase() === skill.toLowerCase()
        )
    );
    const missingSkills = skills.requiredSkills.filter((skill) =>//filter used taaki ek ek karke utaye,some used ki kuch match hua taleat ek 
        !skills.resumeSkills.some(
            (resumeSkill) =>
                resumeSkill.toLowerCase() === skill.toLowerCase()
        )
    );
    const skillSuggestions = missingSkills.map(
        (skill) => `Consider learning or gaining experience with ${skill} for this role.`
    );
    const finalSuggestions = [
        ...analysisResult.suggestions,
        ...skillSuggestions
    ];
    const keywordScore = skills.requiredSkills.length > 0
    ? Math.round(
        (matchedSkills.length / skills.requiredSkills.length) * 25
    )
    : 0;
    const atsScore = baseScore + keywordScore;

    const atsAnalysis = await ATSAnalysis.create({
        owner: req.user._id,
        resume: resume._id,
        atsScore: atsScore,
    
        sectionScore: analysisResult.sectionScore,
        contactScore: analysisResult.contactScore,
        contentScore: analysisResult.contentScore,
        keywordScore: keywordScore,
        resumeSkills: skills.resumeSkills,
requiredSkills: skills.requiredSkills,

matchedSkills: matchedSkills,
missingSkills: missingSkills,

missingSections: analysisResult.missingSections,
suggestions: finalSuggestions,
});
return res
.status(201)
.json(
    new ApiResponse(
        201,
        atsAnalysis,
        "ATS analysis completed successfully"
    )
);
});
const getAnalysisById = asyncHandler(async (req, res) => {
    const { analysisId } = req.params;

    const analysis = await ATSAnalysis.findById(analysisId);

    if (!analysis) {
        throw new ApiError(404, "Analysis not found");
    }

    if (analysis.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to view this analysis");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, analysis, "Analysis fetched successfully"));
});
export { analyzeResume,getAnalysisById };