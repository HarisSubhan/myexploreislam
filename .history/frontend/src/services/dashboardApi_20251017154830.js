// services/dashboardApi.js
import axios from "axios";
import { baseUrl } from "../services/config";

const API_BASE_URL = `${baseUrl}/api`;

export const dashboardAPI = {
  getSummary: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  },
};
