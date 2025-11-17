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

export const getSubscriptionsParentByIdApi = async (id) => {
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

// Other parent dashboard API calls can be added here
export const getParentStatsApi = async (id, range) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(
      `${baseUrl}/api/parent-dashboard/${id}/stats`,
      {
        params: { range },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching parent stats:", error);
    throw error;
  }
};
