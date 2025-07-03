import axios from "axios";
import { baseUrl, getToken } from "../services/config";

// Upload a new book (Admin only)
export const uploadBook = async (formData, token) => {
  try {
    const response = await axios.post(`${baseUrl}/api/books`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || "Failed to upload book";
    throw new Error(message);
  }
};

// Get all books (Public)
export const getAllBooks = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/books`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Get a single book by ID (Public)
export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/books/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch book");
  }
};

// Update a book by ID (Admin only)
export const updateBook = async (id, updatedData) => {
  try {
    const token = getToken();
    const response = await axios.put(`${baseUrl}/api/books/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update book");
  }
};

// Delete a book by ID (Admin only)
export const deleteBook = async (id) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${baseUrl}/api/books/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete book");
  }
};
