// services/childActivity.js
import axios from "axios";
import { baseUrl, getToken } from "./config";

export const dashboardApi = {
  getChildActivity: async (childId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/activity/${childId}/all-logs`,
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
  
  getChildrenActivity: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/activity/${parentId}/children-activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching children activity:", error);
      throw error;
    }
  },

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

  getChildrenStats: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/parent-dashboard/${parentId}/children-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching children stats:", error);
      // Return a default structure instead of throwing
      return {
        data: {
          data: {
            active_subscriptions_7days: 0,
            new_signups_7days: 0,
            open_tickets_7days: 0
          }
        }
      };
    }
  },

  logVideoWatch: async (childId, videoId, videoTitle) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${baseUrl}/api/videos/watch`,
        {
          child_id: childId,
          video_id: videoId,
          video_title: videoTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error logging video watch:", error);
      throw error;
    }
  },
};