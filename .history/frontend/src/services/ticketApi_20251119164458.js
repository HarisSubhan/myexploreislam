// services/ticketapi.js
import axios from "axios";
import { baseUrl, getToken } from "../services/config";

const API_URL = `${baseUrl}/api/tickets`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const ticketApi = {
  // Create ticket
 create: async (ticketData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('User not authenticated. Please log in again.');
      }

      const response = await axios.post('/api/tickets/create', ticketData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
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

  // Update ticket status to resolved
  markAsResolved: async (ticketId) => {
    try {
      const response = await api.put(`/${ticketId}/resolved`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to mark ticket as resolved");
    }
  },

  // Update ticket status to in-progress
  markAsInProgress: async (ticketId) => {
    try {
      const response = await api.put(`/${ticketId}/in-progress`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to mark ticket as in progress");
    }
  },

  // Optional: Generic status update method
  updateStatus: async (ticketId, status) => {
    try {
      const endpoint = status === "resolved" ? "resolved" : "in-progress";
      const response = await api.put(`/${ticketId}/${endpoint}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.message || `Failed to update ticket status to ${status}`
      );
    }
  },
};

export default ticketApi;
