// services/couponApi.js
import axios from "axios";
import { baseUrl,  } from "../services/config";


const API_BASE_URL = `${baseUrl}/api`;

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

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const adminDashboardAPI = {
  // Get basic stats
  getStats: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get dashboard summary metrics
  getDashboardSummary: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get revenue data (you can replace this with actual API when available)
  getRevenueData: async () => {
    // Mock data - replace with actual API call
    return [
      { month: "Last Month", revenue: 42850 },
      { month: "This Month", revenue: 45280 },
    ];
  },

  // Get additional metrics (you can expand this based on your API)
  getBusinessMetrics: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const summary = response.data.data;
      
      // Transform API data to match component expectations
      return {
        activeSubscriptions: summary.active_subscriptions_7days || 0,
        subscriptionChange: 2.3, // You might want to calculate this from API data
        newSignups: summary.new_signups_7days || 0,
        revenueThisMonth: 45280, // Get this from your revenue API
        churnRate: 1.2, // Calculate this from your data
        openSupportTickets: summary.open_tickets_7days || 0,
      };
    } catch (error) {
      console.error('Failed to fetch business metrics', error);
      // Return default values if API fails
      return {
        activeSubscriptions: 0,
        subscriptionChange: 0,
        newSignups: 0,
        revenueThisMonth: 0,
        churnRate: 0,
        openSupportTickets: 0,
      };
    }
  }
};

export default adminDashboardAPI;


