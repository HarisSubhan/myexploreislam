// services/dashboardApi.js
import axios from "axios";
import { baseUrl } from "../services/config";

const API_BASE_URL = `${baseUrl}/api`;

export const dashboardAPI = {
  getSummary: async () => {
    try {
      const token = localStorage.getItem("token");z
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
    apiClient.get(`/parent-dashboard/${parentId}/activity`, {
      params: { range },
    }),

  // Fetch children list
  getChildren: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/children`),

  // Fetch timeline activities
  getTimeline: (parentId, limit = 10) =>
    apiClient.get(`/parent-dashboard/${parentId}/timeline`, {
      params: { limit },
    }),

  // Fetch subscription details
  getSubscription: (parentId) =>
    apiClient.get(`/parent-dashboard/${parentId}/subscription`),
};

// Mock data generators (keep these separate or remove when real APIs are ready)
export const mockData = {
  generateActivityData: (range) => [
    { date: "2024-01-01", child1: 120, child2: 90, child3: 150 },
    { date: "2024-01-02", child1: 80, child2: 110, child3: 130 },
  ],

  generateChildrenData: () => [
    {
      name: "Child 1",
      status: "Active",
      usage: "2h 30m",
      lastActive: "2 hours ago",
    },
    {
      name: "Child 2",
      status: "Active",
      usage: "1h 45m",
      lastActive: "5 hours ago",
    },
  ],

  generateTimelineData: () => [
    {
      time: "10:30 AM",
      child: "Child 1",
      activity: "Completed Math Assignment",
      type: "success",
    },
    {
      time: "09:15 AM",
      child: "Child 2",
      activity: "Started Reading Session",
      type: "info",
    },
  ],

  generateSubscriptionData: () => ({
    plan: "Family Premium",
    status: "Active",
    renewalDate: "2024-12-31",
    childrenUsed: 2,
    childrenLimit: 5,
  }),
};