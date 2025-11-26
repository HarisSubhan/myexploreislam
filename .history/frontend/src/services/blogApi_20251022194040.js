// src/services/blogApi.js
import axios from "axios";
import { baseUrl } from "./config";

// Simple blog API functions
export const blogApi = {
  // Get latest blogs
  getLatestBlogs: async () => {
    const response = await axios.get(`${baseUrl}/api/blogs/public/latest`);
    return response.data;
  },

  // Get single blog by ID
  getBlogById: async (id) => {
    const response = await axios.get(`${baseUrl}/api/blogs/public/${id}`);
    return response.data;
  },
};

export default blogApi;
