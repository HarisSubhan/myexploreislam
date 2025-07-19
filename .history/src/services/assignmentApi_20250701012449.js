import { baseUrl, getToken } from "../services/config";

// Upload new assignment
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

// Get all assignments
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

// Get single assignment by ID
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

// Update assignment
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

// Delete assignment
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
