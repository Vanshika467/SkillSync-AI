import api from "./api.js";

const analyzeResume = async (resumeId, jobDescription) => {// kis resumeid ko analyze karna hain 
    const response = await api.post(`/ats/analyze/${resumeId}`, {
        jobDescription,
    });
    return response.data;
};
const getAnalysisById = async (analysisId) => {
    const response = await api.get(`/ats/${analysisId}`);
    return response.data;
};

export { analyzeResume,getAnalysisById };