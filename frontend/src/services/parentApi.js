import axios from "axios";
import { baseUrl, getToken } from "../services/config";

const API_URL = `${baseUrl}/api/child-requests`;

// Helper function to create headers with token
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Content Assignment APIs
export const assignContentToChildApi = async (assignData) => {
  const response = await axios.post(
    `${baseUrl}/api/parent/assign-content`, 
    assignData, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getAssignedContentApi = async (childId) => {
  const response = await axios.get(
    `${baseUrl}/api/parent/child/${childId}/assigned-content`, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Child Management APIs
export const addChildApi = async (childData) => {
  const response = await axios.post(
    `${baseUrl}/api/parent/add-child`,
    childData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getChildrenByParentIdApi = async (parentId) => {
  const response = await axios.get(
    `${baseUrl}/api/children/${parentId}/children`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateChildApi = async (childId, childData) => {
  const response = await axios.put(
    `${baseUrl}/api/children/${childId}/edit`,
    childData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateChildStatusApi = async (childId, isActive) => {
  const response = await axios.put(
    `${baseUrl}/api/children/${childId}/status`,
    { is_active: isActive },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteChildApi = async (childId, parentId) => {
  const response = await axios.delete(
    `${baseUrl}/api/parent/child/${childId}`,
    {
      data: { parent_id: parentId },
      headers: getAuthHeaders()
    }
  );
  return response.data;
};

// Child Color API
export const addChildColorApi = async (colorData) => {
  const response = await axios.post(
    `${baseUrl}/api/child/color`, 
    colorData, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Child Request APIs
export const requestedChildApi = async (requestData) => {
  const response = await axios.post(
    `${baseUrl}/api/child-requests/`,
    requestData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getChildRequests = async () => {
  const response = await axios.get(
    API_URL, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateChildRequestStatusApi = async ({ requestId, status }) => {
  const response = await axios.put(
    `${baseUrl}/api/child-requests/${requestId}`,
    { status },
    { headers: getAuthHeaders() }
  );
  return response.data;
};