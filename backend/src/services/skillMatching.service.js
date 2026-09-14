import { ATSAnalysis } from "../models/atsAnalysis.model.js";
import { Job } from "../models/job.model.js";

const matchResumeWithJobs = async (userId, targetRole) => {
    const latestAnalysis = await ATSAnalysis.findOne({ owner: userId }).sort({ createdAt: -1 });//-1 used for descending order 

    if (!latestAnalysis) {
        return null;
    }

    const resumeSkills = latestAnalysis.resumeSkills || [];

    const jobQuery = { requiredSkills: { $exists: true, $ne: [] } };

    // agar targetRole diya gaya hai, toh sirf usi role ki jobs filter karo
    // warna purani tarah saari jobs le lo (backward compatible)
    if (targetRole) {
        jobQuery.title = { $regex: targetRole, $options: "i" };
    }

    const jobs = await Job.find(jobQuery);

    if (!jobs || jobs.length === 0) {
        return { resumeSkills, matches: [], topMissingSkills: [] };
    }
    const normalizedResumeSkills = resumeSkills.map((skill) =>
        skill.trim().toLowerCase()
    );
    const matches = jobs.map((job) => {//ye saari jobs ke upar hover kiya hain 
        const jobSkills = job.requiredSkills.map((skill) =>// yahga ek particular job ke datra ko fetch koiya hain 
            skill.trim().toLowerCase()
        );

        const matchedSkills = jobSkills.filter((skill) =>
            normalizedResumeSkills.includes(skill)
        );

        const missingSkills = jobSkills.filter(
            (skill) => !normalizedResumeSkills.includes(skill)
        );

        const skillMatchPercentage =
            jobSkills.length > 0
                ? Math.round((matchedSkills.length / jobSkills.length) * 100)
                : 0;

        return {
            jobId: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            jobUrl: job.jobUrl,
            skillMatchPercentage,
            matchedSkills,
            missingSkills,
        };
    });
    matches.sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);
    const missingSkillFrequency = {};

    matches.forEach((job) => {
        job.missingSkills.forEach((skill) => {
            missingSkillFrequency[skill] = (missingSkillFrequency[skill] || 0) + 1;
        });
    });

    const MAX_SKILLS_FOR_ROADMAP = 15;

const topMissingSkills = Object.entries(missingSkillFrequency)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_SKILLS_FOR_ROADMAP);
        return { resumeSkills, matches, topMissingSkills };
};

export { matchResumeWithJobs };