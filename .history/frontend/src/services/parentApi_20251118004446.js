// ParentApi
import axios from "axios";
import { baseUrl, getToken } from "../services/config";

const API_URL = `${baseUrl}/api/child-requests`;

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
    console.log("Add Child Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Add Child Error:", error.response?.data || error.message);
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
    console.log("Get Children Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Children Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch children" };
  }
};

export const addChildColorApi = async (colorData) => {
  // Fixed typo: APi -> Api
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.post(`${baseUrl}/api/child/color`, colorData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Add Child Color Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Add Child Color Error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to add child color" };
  }
};

// Update Child Status API
export const updateChildStatusApi = async (childId, isActive) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.put(
      `${baseUrl}/api/children/${childId}/status`,
      { is_active: isActive }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Update Child Status Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Update Child Status Error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to update child status" };
  }
};

// Child Request APIs
export const requestedChildApi = async (requestData) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.post(
      `${baseUrl}/api/child-requests/`,
      requestData, // Send the complete object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Request Child Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Request Child Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to send request"
    );
  }
};

export const getChildRequests = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching child requests:", error);
    throw error;
  }
};

export const updateChildRequestStatusApi = async ({ requestId, status }) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in.");

  try {
    const response = await axios.put(
      `${baseUrl}/api/child-requests/${requestId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Update Request Status Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Update Request Status Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update request status"
    );
  }
};

// Delete Child API
export const deleteChildApi = async (childId, parentId) => {
  const token = getToken();

  if (!token) throw new Error("You are not logged in. Please log in first.");

  try {
    const response = await axios.delete(
      `${baseUrl}/api/parent/child/${childId}`,
      {
        data: { parent_id: parentId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Delete Child Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete Child Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete child" };
  }
};



export const assignContentToChildApi = async (assignData) => {
  try {
    const response = await axios.post(`${baseUrl}/api/parent/assign-content', assignData);
    return response.data;
  } catch (error) {
    throw error;
  }
};