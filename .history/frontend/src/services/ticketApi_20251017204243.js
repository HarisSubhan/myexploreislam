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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const ticketApi = {
  // Create a new ticket - now accepts parentId as parameter
  create: async (ticketData, parentId) => {
    try {
      if (!parentId) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const payload = {
        ...ticketData,
        parent_id: parentId,
      };

      console.log("Creating ticket with payload:", payload);
      const response = await api.post("/create", payload);
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

  // Get tickets by parent ID
  getByParentId: async (parentId) => {
    try {
      const response = await api.get(`/parent/${parentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch parent tickets");
    }
  },

  // Update ticket status or add reply
  update: async (ticketId, updateData) => {
    try {
      const response = await api.put(`/update/${ticketId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update ticket");
    }
  },
};

export default ticketApi;
