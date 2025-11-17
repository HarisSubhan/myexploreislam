import axios from "axios";
import { baseUrl, getToken } from "./config";

export const dashboardApi = {
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
};
