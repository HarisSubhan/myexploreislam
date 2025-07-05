import axios from "axios";
import { baseUrl, getToken } from "../services/config";

const subscriptionApi = axios.create({
  baseURL: `${baseUrl}/api/subscriptions`,
  headers: {
    "Content-Type": "application/json",
  },
});


subscriptionApi.interceptors.request.use(
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

const subscribeApi = {
 
  subscribe: async (subscriptionData) => {
    try {
      const response = await subscriptionApi.post("/subscribe", subscriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getMySubscription: async () => {
    try {
      const response = await subscriptionApi.get("/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  cancelSubscription: async () => {
    try {
      const response = await subscriptionApi.post("/cancel");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  
  getAllSubscriptions: async () => {
    try {
      const response = await subscriptionApi.get("/admin/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default subscribeApi;