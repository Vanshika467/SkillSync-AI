import api from "./api.js";

const registerUser = async (formData) => {
    const response = await api.post("/users/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",// json text bas nhi form mein file data bhi add karenge 
        },
    });
    return response.data;// hame response mein kerval data nikalna hain 
};

const loginUser = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
};

export { registerUser, loginUser };