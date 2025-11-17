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


// services/api.js
export const RegisterApi = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Create Stripe Checkout Session
export const createStripeCheckoutSession = async (checkoutData) => {
  try {
    const response = await fetch('http://localhost:5000/api/subscriptions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Checkout session creation failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

