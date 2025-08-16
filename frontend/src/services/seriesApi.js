// services/seriesApi.js
import axios from "axios";

export const getSeriesApi = () => {
  const token = localStorage.getItem("token"); // 👈 token uthao
  return axios.get("/api/series", {
    headers: {
      Authorization: `Bearer ${token}`, // 👈 backend ko token bhejo
    },
  });
};
