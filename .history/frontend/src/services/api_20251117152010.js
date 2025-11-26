import axios from "axios";
import { baseUrl, getToken } from "../services/config";




export const authAPI = {
  logout: async (role = null) => {
    try {
      const token = getToken();

      if (!token) {
        console.warn("No token found, proceeding with client-side logout");
        return { success: true };
      }

      const requestData = {};

      if (role) {
        requestData.role = role;
      }

      const response = await axios.post(
        `${baseUrl}/api/auth/logout`,
        requestData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Logout API error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        
        return { success: true };
      }

      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },
};





export const LoginApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/login`, data);
  return res.data; // Return the response data as is
};

export const setPasswordApi = async (email, password) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/set-password`,
      { email, password }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Server error. Try again later."
    );
  }
};

export const RegisterApi = async (data) => {
  const res = await axios.post(`${baseUrl}/api/auth/register`, data);
  return res.data;
};

export const addChild = async (childData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You are not logged in. Please log in first.");

  const response = await axios.post(
    `${baseUrl}/api/parent/add-child`,
    childData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};


export const getUserNameApi = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You are not logged in. Please log in first.");

  const response = await axios.get(`${baseUrl}/api/me/name`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data; // { name, email }
};

export const createCheckoutSession = async (checkoutData) => {
  try {
    const response = await axios.post(`${baseUrl}/subscriptions/create-checkout-session`, checkoutData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify payment status
export const verifyPaymentStatus = async (sessionId) => {
  try {
    const response = await axios.get(`${baseUrl}/subscriptions/verify-payment/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};