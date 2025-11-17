// services/couponApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const couponApi = {
  // Get all coupons
  getAllCoupons: async () => {
    const response = await api.get("/coupons");
    return response.data;
  },

  // Create new coupon
  createCoupon: async (couponData) => {
    const response = await api.post("/coupons/create", couponData);
    return response.data;
  },

  // Update coupon
  updateCoupon: async (id, couponData) => {
    const response = await api.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },

  // Get coupon by ID
  getCouponById: async (id) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },
};
