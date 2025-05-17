import axios from "axios";

// https://myexploreislam.vercel.app/
// http://localhost:5173/

const api = axios.create({
  baseURL: "hhttp://localhost:5173/",
});

export default api;
