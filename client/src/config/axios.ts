import axios from "axios";
import { BACKEND_URL } from "./config";

const api = axios.create({
    baseURL: BACKEND_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); 
        if (token) {
            config.headers.Authorization = token; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
