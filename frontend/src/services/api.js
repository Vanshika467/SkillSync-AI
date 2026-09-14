//poora url na likhna pade isiliye banaya hain ek base url setup karde 
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,// this is used if we are using cookie to store refresh token 
});

export default api;