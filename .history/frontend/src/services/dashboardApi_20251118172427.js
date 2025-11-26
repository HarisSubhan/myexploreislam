// services/dashboardApi.js
import axios from "axios";
import { baseUrl } from "../services/config";

const API_BASE_URL = `${baseUrl}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
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
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions
export const dashboardApi = {
  // Fetch children activity data
  getChildrenActivity: (parentId) =>
    apiClient.get(`/parent/${parentId}/children/activity`),

  // Fetch recent activity
  getRecentActivity: (parentId) =>
    apiClient.get(`/parent/${parentId}/recent-activity`),

  // Fetch children stats
  getChildrenStats: (parentId) =>
    apiClient.get(`/parent/${parentId}/children-stats`),

  // Fetch combined activity data
  getCombinedActivity: (parentId, range) =>
    apiClient.get(`/parent/${parentId}/activity`, {
      params: { range },
    }),

  // Fetch children list
  getChildren: (parentId) =>
    apiClient.get(`/parent/${parentId}/children`),

  // Fetch timeline activities
  getTimeline: (parentId, limit = 10) =>
    apiClient.get(`/parent/${parentId}/timeline`, {
      params: { limit },
    }),

  // Fetch subscription details
  getSubscription: (parentId) =>
    apiClient.get(`/parent/${parentId}/subscription`),
};

// Legacy API functions for backward compatibility
export const dashboardAPI = {
  getSummary: async () => {
    try {
      const response = await apiClient.get("/dashboard/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await apiClient.get("/admin/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  },
};