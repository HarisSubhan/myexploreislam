import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5173/

const api = axios.create({
  baseURL: "https://myexploreislam.vercel.app/",
});

export default api;
