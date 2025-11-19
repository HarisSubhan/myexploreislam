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



// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions
export const dashboardApi = {
  // Fetch children stats
  getChildrenStats: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/children-stats`),

  // Fetch combined activity data
  getCombinedActivity: (parentId, range) =>
    apiClient.get(`/parent-dashboard/${parentId}/childrenactivity`, {
      params: { range },
    }),

  // Fetch children list
  getChildren: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/children`),

  // Fetch timeline activities
  getTimeline: (parentId, limit = 10) =>
    apiClient.get(`/activity/${parentId}/children-activity`, {
      params: { limit },
    }),

  // Fetch subscription details
  getSubscription: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/subscription`),
};

