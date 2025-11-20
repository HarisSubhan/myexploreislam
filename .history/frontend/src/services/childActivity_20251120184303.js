import axios from "axios";
import { baseUrl, getToken } from "./config";

export const dashboardApi = {

   getChildrenStats: (parentId) =>
    const response = await axios.get(
      `$`
    )
    apiClient.get(`/parent-dashboard/${parentId}/children-stats`),


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
  // Get children activity data for chart
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

  // Get recent activity timeline
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

  

  // Log video watch activity
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
