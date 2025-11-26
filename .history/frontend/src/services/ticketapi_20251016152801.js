// services/ticketapi.js
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

// Helper: safe parse localStorage user
const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    return null;
  }
};

// Helper: decode JWT (safe) to extract payload (no dependency)
const decodeJwtPayload = (token) => {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadB64 = parts[1];
    // base64url -> base64
    const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    // pad
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const json = atob(b64 + pad);
    return JSON.parse(json);
  } catch (err) {
    console.warn("Failed to decode JWT payload:", err);
    return null;
  }
};

// Robust current user getter - attempts many fallbacks
const getCurrentUser = () => {
  // 1) From localStorage (most preferred)
  const stored = parseStoredUser();
  if (stored && Object.keys(stored).length > 0) {
    // try to ensure id field present by searching common fields
    const id =
      stored.id ||
      stored.userId ||
      stored._id ||
      stored.user_id ||
      (stored.email ? stored.email : undefined);

    return {
      ...stored,
      id: id || undefined,
    };
  }

  // 2) Try to infer from JWT token payload
  const token = getToken() || localStorage.getItem("token");
  const payload = decodeJwtPayload(token);
  if (payload) {
    const id = payload.id || payload.userId || payload.sub || payload._id;
    const email = payload.email || payload.emails || undefined;
    if (id || email) {
      return {
        id: id || email,
        name: payload.name || payload.username || undefined,
        email: email,
        role: payload.role || undefined,
      };
    }
  }

  // 3) Nothing found - return null
  return null;
};

export const ticketApi = {
  // Create a new ticket
  create: async (ticketData) => {
    try {
      const user = getCurrentUser();
      const parentId = user?.id;

      if (!parentId) {
        // helpful debugging message + final guard
        console.error("ticketApi.create: no parentId resolved", {
          user,
          ticketData,
        });
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
      // normalize error
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

  // Get tickets by parent ID (if you add this endpoint later)
  getByParentId: async (parentId) => {
    try {
      const response = await api.get(`/parent/${parentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch parent tickets");
    }
  },
};

export default ticketApi;
