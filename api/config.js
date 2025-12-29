import axios from "axios";
import { serverConstants } from "./server-constant";
const publicApi = axios.create({
    baseURL: serverConstants.authenticationUrls,
});
const securedApi = axios.create({
    baseURL: serverConstants.authenticationUrls,
});
securedApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
export { publicApi, securedApi };

