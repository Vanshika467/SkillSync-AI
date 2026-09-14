import api from "./api.js";

const generateRoadmap = async (targetRole) => {
    const response = await api.post("/roadmap/generate", null, {
        params: { targetRole },
    });
    return response.data;
};
const getMyRoadmap = async () => {
    const response = await api.get("/roadmap/my-roadmap");
    return response.data;
};

export { generateRoadmap, getMyRoadmap };