// In your services/config.js or services/subscriptionService.js
import axios from "axios";
import { baseUrl, getToken } from "../services/config";

export const getsubscriptionsAllActiveApi = async () => {
  const token = getToken();
  const response = await axios.get(`${baseUrl}/api/subscriptions/all_active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getsubscriptionsParentByidApi = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(
      `${baseUrl}/api/parent-dashboard/${id}/subscription`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    throw error;
  }
};

// Add these new service functions
export const createSubscriptionApi = async (formData) => {
  const token = getToken();
  const response = await axios.post(
    `${baseUrl}/api/subscriptions/subscribe`, 
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateSubscriptionApi = async (id, formData) => {
  const token = getToken();
  const response = await axios.put(
    `${baseUrl}/api/subscriptions/${id}`, 
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteSubscriptionApi = async (id) => {
  const token = getToken();
  const response = await axios.delete(
    `${baseUrl}/api/subscriptions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateSubscriptionStatusApi = async (id, status) => {
  const token = getToken();
  const response = await axios.put(
    `${baseUrl}/api/subscriptions/${id}/status`,
    { is_active: status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};