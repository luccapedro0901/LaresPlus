import axios from "axios";

const api = axios.create({
    baseURL: "https://load-coordinator-systematic-captured.trycloudflare.com", //uso de tunel atraves do Cloudflare, sendo necessario criar um tunel toda vez que rodar novamente o backend
});

export default api;