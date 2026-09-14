import api from "./api.js";

const uploadResume = async (formData) => {
    const response = await api.post("/resumes/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",// meas data mein file bhi present hain 
        },
    });
    return response.data;
};

const getMyResumes = async () => {
    const response = await api.get("/resumes/my-resumes");
    return response.data;
};

const getResumeById = async (resumeId) => {
    const response = await api.get(`/resumes/${resumeId}`);
    return response.data;
};

export { uploadResume, getMyResumes, getResumeById };