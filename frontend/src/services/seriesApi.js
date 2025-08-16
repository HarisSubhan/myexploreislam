import axios from "axios";

export const getSeriesApi = () => {
  return axios.get("http://localhost:5000/api/series");
};
