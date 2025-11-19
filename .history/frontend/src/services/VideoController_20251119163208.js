// services/videoService.js
import axios from "axios";
import { baseUrl, getToken } from "./config";

export const videoService = {
  // Get all series
  getAllSeries: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/series/all-series`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching series:", error);
      throw error;
    }
  },

    getAllwithoutseriesVideos: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/videos//without-series`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },

  // Get all videos
  getAllVideos: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/videos/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },

  // Get single video by ID
  getVideoById: async (videoId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching video:", error);
      throw error;
    }
  }
};