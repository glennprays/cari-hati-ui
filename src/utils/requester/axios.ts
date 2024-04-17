import axios from "axios";

export default axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});
export const axiosPrivate = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
