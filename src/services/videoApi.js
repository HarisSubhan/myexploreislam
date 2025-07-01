import axios from "axios";
import { baseUrl, getToken } from "../services/config";

export const uploadVideoApi = async (formData) => {
  try {
    const token = getToken(); // If you're using auth

    const response = await axios.post(`${baseUrl}/api/videos/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Include only if your backend requires token
      },
    });

    return response.data;
  } catch (error) {
    console.error("Video upload error:", error);
    throw error;
  }
};



export const getAllVideosApi = async () => {
  const token = getToken();

  const response = await axios.get(`${baseUrl}/api/videos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getVideoByIdApi = async (id) => {
  const token = getToken();

  const response = await axios.get(`${baseUrl}/api/videos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
