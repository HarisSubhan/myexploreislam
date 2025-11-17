import axios from "axios";
import { baseUrl, getToken } from "./config";

// Mock data generator (fallback)
export const mockData = {
  generateActivityData: (range = "7d") => {
    const days = range === "7d" ? 7 : 30;
    const demoData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split("T")[0];

      demoData.push({
        date: dateStr,
        "Child 1": Math.floor(Math.random() * 120),
        "Child 2": Math.floor(Math.random() * 120),
        "Child 3": Math.floor(Math.random() * 90),
      });
    }
    return demoData;
  },

  generateChildrenData: () => [
    {
      child_id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      total_active_minutes: 240,
      total_active_hours: "4.00",
    },
    {
      child_id: 2,
      name: "Sarah Smith",
      username: "sarahsmith",
      email: "sarah@example.com",
      total_active_minutes: 180,
      total_active_hours: "3.00",
    },
  ],

  generateTimelineData: () => [
    {
      id: 1,
      child_name: "John Doe",
      activity_type: "quiz",
      description: "Completed Quran Quiz",
      time: "2 hours ago",
    },
    {
      id: 2,
      child_name: "Sarah Smith",
      activity_type: "video",
      description: "Watched Islamic History Video",
      time: "4 hours ago",
    },
  ],

  generateSubscriptionData: () => ({
    plan: "Family Premium",
    status: "active",
    renewal_date: "2025-12-31",
    children_count: 3,
    max_children: 5,
  }),
};

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

  // Get children stats
  getChildrenStats: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/parent/${parentId}/children-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching children stats:", error);
      throw error;
    }
  },

  // Get children list
  getChildren: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/parent/${parentId}/children`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching children list:", error);
      throw error;
    }
  },

  // Get activity timeline
  getTimeline: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/parent/${parentId}/timeline`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching timeline:", error);
      throw error;
    }
  },

  // Get subscription info
  getSubscription: async (parentId) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${baseUrl}/api/parent/${parentId}/subscription`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      throw error;
    }
  },
};
