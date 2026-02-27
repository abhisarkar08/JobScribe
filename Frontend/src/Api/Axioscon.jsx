import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  withCredentials: true, // 🔥 VERY IMPORTANT (cookies)
});

export default instance;