import { Job } from "../models/job.model.js";

const getMarketSkillDemand = async () => {
    const jobs = await Job.find({ requiredSkills: { $exists: true, $ne: [] } });

    const allSkills = jobs.flatMap((job) => job.requiredSkills);// ek hi array mein sari jobs aajati,.map se nested array milta isse flaten aray mila 
    const skillFrequency = {};

    allSkills.forEach((skill) => {
        const normalizedSkill = skill.trim().toLowerCase();
        skillFrequency[normalizedSkill] = (skillFrequency[normalizedSkill] || 0) + 1;//skill(react),undefined hga ya pehke sw hoga or agar  pehle se nhi hain  toh 0 tloh plus 1 karo
    });
    const marketDemand = Object.entries(skillFrequency)//object ko array of pairs mein convert karta hai:
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count);
        return marketDemand;
};

export { getMarketSkillDemand };