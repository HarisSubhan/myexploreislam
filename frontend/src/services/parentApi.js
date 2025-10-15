import axios from "axios";
import { baseUrl, getToken } from "../services/config";

export const addChild = async (childData) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.post(
      `${baseUrl}/api/parent/add-child`,
      childData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add child" };
  }
};


export const requestedChildApi = async ({ requested_children }) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.post(
      `${baseUrl}/api/child-requests`,
      { requested_children },                   // send JSON body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // You can return the full data object from the backend
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to send request"
    );
  }
};
  
export const updateChildRequestStatusApi = async ({ requestId, status }) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in.");

  try {
    const res = await axios.put(
      `${baseUrl}/api/child-requests/${requestId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update request status"
    );
  }
};








export const addChildColorAPi = async (colorData) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.post(
      `${baseUrl}/api/child/color`,
      colorData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add child color" };
  }
};


