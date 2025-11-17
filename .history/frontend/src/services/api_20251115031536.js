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
  return res.data;
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

export const RegisterApi = async (userData) => {
  try {
    console.log("Sending registration data:", userData);
    const response = await axios.post(`${baseUrl}/api/auth/register`, userData);
    
    console.log("Registration API response:", response.data);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message || 'Registration failed');
    }

    return response.data;
  } catch (error) {
    console.error("Registration API error:", error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Registration failed';
    throw new Error(errorMessage);
  }
};

export const createStripeCheckoutSession = async (checkoutData) => {
  try {
    console.log("Creating checkout session:", checkoutData);
    const response = await axios.post(
      `${baseUrl}/api/subscriptions/create-checkout-session`, 
      checkoutData
    );
    
    console.log("Checkout session response:", response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Checkout session creation failed');
    }

    return response.data;
  } catch (error) {
    console.error("Checkout session error:", error);
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Payment session creation failed';
    throw new Error(errorMessage);
  }
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

  return response.data;
};