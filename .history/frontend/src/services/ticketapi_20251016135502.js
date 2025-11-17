import axios from "axios";
import { baseUrl, getToken } from "../services/config";

const API_URL = `${baseUrl}/api/tickets`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const ticketApi = {
  // Create a new ticket
  create: async (ticketData) => {
    try {
      const response = await api.post("/create", ticketData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to create ticket");
    }
  },

  // Get all tickets
  getAll: async () => {
    try {
      const response = await api.get("/all");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch tickets");
    }
  },

  // Get ticket summary
  getSummary: async () => {
    try {
      const response = await api.get("/summary");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch ticket summary");
    }
  },

  // Update ticket (if you add this endpoint later)
  update: async (ticketId, updateData) => {
    try {
      // For now, we'll simulate update since you don't have this endpoint
      // You can remove this method or implement when the endpoint is available
      throw new Error("Update endpoint not available");
    } catch (error) {
      throw new Error(error.message || "Failed to update ticket");
    }
  },

  // Delete ticket (if you add this endpoint later)
  delete: async (ticketId) => {
    try {
      // For now, we'll simulate delete since you don't have this endpoint
      // You can remove this method or implement when the endpoint is available
      throw new Error("Delete endpoint not available");
    } catch (error) {
      throw new Error(error.message || "Failed to delete ticket");
    }
  },

  // Update ticket status (if you add this endpoint later)
  updateStatus: async (ticketId, status) => {
    try {
      // For now, we'll simulate status update since you don't have this endpoint
      // You can remove this method or implement when the endpoint is available
      throw new Error("Status update endpoint not available");
    } catch (error) {
      throw new Error(error.message || "Failed to update ticket status");
    }
  },
};

export default ticketApi;
