// apiService.js
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getToken = () => {
  return localStorage.getItem('authToken');
};

export const notificationService = {
  getRecentActivity: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/parent/${parentId}/recent-activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },

  markAsRead: async (parentId, notificationId) => {
    try {
      const token = getToken();
      const response = await axios.patch(
        `${baseUrl}/api/parent/${parentId}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  clearAll: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.delete(
        `${baseUrl}/api/parent/${parentId}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error clearing notifications:", error);
      throw error;
    }
  },
};