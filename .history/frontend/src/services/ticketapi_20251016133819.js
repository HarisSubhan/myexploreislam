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

export const ticketApi = {
  // Create a new ticket
  create: async (ticketData) => {
    try {
      const response = await api.post("/create", ticketData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create ticket"
      );
    }
  },

  // Get all tickets
  getAll: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch tickets"
      );
    }
  },

  // Get ticket by ID
  getById: async (ticketId) => {
    try {
      const response = await api.get(`/${ticketId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch ticket"
      );
    }
  },

  // Update ticket
  update: async (ticketId, updateData) => {
    try {
      const response = await api.put(`/${ticketId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update ticket"
      );
    }
  },

  // Delete ticket
  delete: async (ticketId) => {
    try {
      const response = await api.delete(`/${ticketId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete ticket"
      );
    }
  },

  // Update ticket status
  updateStatus: async (ticketId, status) => {
    try {
      const response = await api.patch(`/${ticketId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update ticket status"
      );
    }
  },
};

export default ticketApi;
