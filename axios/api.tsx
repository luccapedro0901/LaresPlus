import axios from "axios";

const api = axios.create({
    baseURL: "http://10.100.9.41:8081",
});

export default api;
