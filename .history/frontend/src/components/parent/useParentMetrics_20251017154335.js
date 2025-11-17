// components/parent/useParentMetrics.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useParentMetrics = (range, parentId) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChildren: 0,
    active: 0,
    inactive: 0,
  });
  const [combinedActivity, setCombinedActivity] = useState([]);
  const [children, setChildren] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [subscription, setSubscription] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch children stats
        const statsResponse = await axios.get(
          `http://localhost:5000/api/parent-dashboard/${parentId}/children-stats`
        );

        if (statsResponse.data.data) {
          setStats({
            totalChildren: statsResponse.data.data.total_children || 0,
            active: statsResponse.data.data.active_children || 0,
            inactive: statsResponse.data.data.inactive_children || 0,
          });
        }

        // You can add more API calls here for other data
        // For now, I'll set some mock data for demonstration
        setCombinedActivity(generateMockActivityData(range));
        setChildren(generateMockChildrenData());
        setTimeline(generateMockTimelineData());
        setSubscription(generateMockSubscriptionData());
      } catch (err) {
        console.error("Error fetching parent metrics:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchParentMetrics();
    }
  }, [range, parentId]);

  return {
    loading,
    stats,
    combinedActivity,
    children,
    timeline,
    subscription,
    error,
  };
};

// Mock data generators (replace with actual API calls)
const generateMockActivityData = (range) => {
  // Return mock activity data based on range
  return [
    { date: "2024-01-01", child1: 120, child2: 90, child3: 150 },
    { date: "2024-01-02", child1: 80, child2: 110, child3: 130 },
    // ... more data
  ];
};

const generateMockChildrenData = () => {
  return [
    {
      name: "Child 1",
      status: "Active",
      usage: "2h 30m",
      lastActive: "2 hours ago",
    },
    {
      name: "Child 2",
      status: "Active",
      usage: "1h 45m",
      lastActive: "5 hours ago",
    },
  ];
};

const generateMockTimelineData = () => {
  return [
    {
      time: "10:30 AM",
      child: "Child 1",
      activity: "Completed Math Assignment",
      type: "success",
    },
    {
      time: "09:15 AM",
      child: "Child 2",
      activity: "Started Reading Session",
      type: "info",
    },
  ];
};

const generateMockSubscriptionData = () => {
  return {
    plan: "Family Premium",
    status: "Active",
    renewalDate: "2024-12-31",
    childrenUsed: 2,
    childrenLimit: 5,
  };
};
