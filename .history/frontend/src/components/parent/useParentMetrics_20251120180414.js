// useParentMetrics.js
import { useState, useEffect } from "react";
import { transformChildrenActivityToChartData } from "../../utils/activityDataTransformer";
import { dashboardApi } from "../../services/dashboardApi"; // Fixed import name

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentMetrics = async () => {
      if (!parentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch children stats
        let childrenStats = { total_children: 0, active_children: "0", inactive_children: "0" };
        
        try {
          const childrenStatsResponse = await dashboardApi.getChildrenStats(parentId);
          childrenStats = childrenStatsResponse?.data?.data || childrenStats;
        } catch (err) {
          console.error("Error fetching children stats:", err);
          throw new Error(`Children stats: ${err.message}`);
        }

        // Convert string numbers to integers for stats
        setStats({
          totalChildren: parseInt(childrenStats.total_children) || 0,
          active: parseInt(childrenStats.active_children) || 0,
          inactive: parseInt(childrenStats.inactive_children) || 0,
        });

        // Fetch other data with individual error handling
        let childrenData = [];
        let timelineData = [];

        try {
          const childrenActivityResponse = await dashboardApi.getChildrenActivity(parentId);
          childrenData = childrenActivityResponse?.data?.data || [];
        } catch (err) {
          console.warn("Could not fetch children activity:", err.message);
        }

        try {
          const recentActivityResponse = await dashboardApi.getRecentActivity(parentId);
          timelineData = recentActivityResponse?.data?.data || [];
        } catch (err) {
          console.warn("Could not fetch recent activity:", err.message);
        }

        // Process children activity data
        if (childrenData.length > 0) {
          const chartData = transformChildrenActivityToChartData(childrenData);
          setCombinedActivity(chartData);
          setChildren(childrenData);
        } else {
          setCombinedActivity([]);
          setChildren([]);
        }

        // Set timeline data
        setTimeline(timelineData);

      } catch (err) {
        console.error("Error in fetchParentMetrics:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load dashboard data";
        setError(errorMessage);
        
        // Reset on error
        setStats({ totalChildren: 0, active: 0, inactive: 0 });
        setCombinedActivity([]);
        setChildren([]);
        setTimeline([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParentMetrics();
  }, [range, parentId]);

  return {
    loading,
    stats,
    combinedActivity,
    children,
    timeline,
    error,
  };
};