import axios from "axios";
import { baseUrl, getToken } from "../services/config";

// Child Management APIs
export const addChildApi = async (childData) => {
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

export const getChildrenByParentIdApi = async (parentId) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.get(
      `${baseUrl}/api/parent/${parentId}/children`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch children" };
  }
};

export const addChildColorAPi = async (colorData) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.post(`${baseUrl}/api/child/color`, colorData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add child color" };
  }
};

// Child Request APIs
export const requestedChildApi = async (requested_children) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.post(
      `${baseUrl}/api/child-requests/`,
      { requested_children },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

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
