// services/dashboardApi.js
import axios from "axios";
import { baseUrl } from "../services/config";

const API_BASE_URL = `${baseUrl}/api`;

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

export const dashboardApi = {
  // Fetch children stats
  getChildrenStats: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/children-stats`),

  // Fetch combined activity data
  getCombinedActivity: (parentId, range) =>
    apiClient.get(`/parent/${parentId}/children-activity`, {
      params: { range },
    }),

  // Fetch timeline activities
  getTimeline: (parentId, limit = 10) =>
    apiClient.get(`/activity/${parentId}/children-activity`, {
      params: { limit },
    }),

  // Fetch subscription details
  getSubscription: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/subscription`),
};