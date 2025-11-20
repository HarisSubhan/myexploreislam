// services/dashboardApi.js
import axios from "axios";
import { baseUrl } from "../services/config";

const API_BASE_URL = `${baseUrl}/api`;

// Create axios instance with common configuration
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
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions - use consistent naming (dashboardApi)
export const dashboardApi = {
  // Dashboard summary
  getSummary: () => apiClient.get("/dashboard/summary"),
  
  // Admin stats
  getStats: () => apiClient.get("/admin/stats"),

  // Fetch children stats
  getChildrenStats: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/children-stats`),

  // Fetch children activity data
  getChildrenActivity: (parentId) =>
    apiClient.get(`/parent/${parentId}/children-activity`),

  // Fetch recent activity
  getRecentActivity: (parentId) =>
    apiClient.get(`/activity/${parentId}/children-activity`),

  // Fetch subscription details
  getSubscription: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/subscription`),
};