import { baseUrl, getToken } from "../services/config";


export const uploadAssignment = async (formData) => {
  const token = getToken();

  if (!token) throw new Error("Not authorized");

  try {
    const response = await fetch(`${baseUrl}/api/assignments/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Upload failed");
    }

    return result;
  } catch (error) {
    throw error;
  }
};


export const getAllAssignments = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/assignments`);
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Failed to fetch assignments");

    return data;
  } catch (error) {
    throw error;
  }
};


export const getAssignmentById = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/assignments/${id}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Assignment not found");

    return data;
  } catch (error) {
    throw error;
  }
};


export const updateAssignment = async (id, formData) => {
  const token = getToken();

  if (!token) throw new Error("Not authorized");

  try {
    const response = await fetch(`${baseUrl}/api/assignments/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Update failed");
    }

    return result;
  } catch (error) {
    throw error;
  }
};


export const deleteAssignment = async (id) => {
  const token = getToken();

  if (!token) throw new Error("Not authorized");

  try {
    const response = await fetch(`${baseUrl}/api/assignments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Delete failed");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

import {
  uploadAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../services/";
  