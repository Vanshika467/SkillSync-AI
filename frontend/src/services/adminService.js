import api from "./api.js";

const getPlatformStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data;
};

const getMissingSkillsTrend = async () => {
    const response = await api.get("/admin/missing-skills-trend");
    return response.data;
};

export { getPlatformStats, getMissingSkillsTrend };