import api from "./api.js";

const searchJobs = async (role, location) => {
    const response = await api.get("/jobs/search", {
        params: { role, location },
    });
    return response.data;
};

const matchJobs = async (targetRole) => {
    const response = await api.get("/jobs/match", {
        params: { targetRole },
    });
    return response.data;
};

export { searchJobs, matchJobs };