import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://jobscribe-43eq.onrender.com/api"
      : "http://localhost:3000/api",
  withCredentials: true,
});

export default instance;