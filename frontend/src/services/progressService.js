import api from "./api.js";

const markItemComplete = async (weekNumber, type, itemIndex) => {
    const response = await api.post("/progress/mark-complete", {
        weekNumber,
        type,
        itemIndex,
    });
    return response.data;
};

const getMyProgress = async () => {
    const response = await api.get("/progress/my-progress");
    return response.data;
};

export { markItemComplete, getMyProgress };