// useParentMetrics.js
import { useState, useEffect } from "react";
import { dashboardApi } from "../../services/childActivity";
import { transformChildrenActivityToChartData } from "../../utils/activityDataTransformer";

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
        console.log("No parentId provided, skipping fetch");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching metrics for parent:", parentId);

        // Fetch children stats - with better error handling
        let childrenStats = { total_children: 0, active_children: "0", inactive_children: "0" };
        
        try {
          const childrenStatsResponse = await dashboardApi.getChildrenStats(parentId);
          console.log("Children stats response:", childrenStatsResponse);
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
          console.log("Children activity response:", childrenActivityResponse);
          childrenData = childrenActivityResponse?.data?.data || [];
        } catch (err) {
          console.warn("Could not fetch children activity:", err.message);
          // Don't throw error for this, just use empty array
        }

        try {
          const recentActivityResponse = await dashboardApi.getRecentActivity(parentId);
          console.log("Recent activity response:", recentActivityResponse);
          timelineData = recentActivityResponse?.data?.data || [];
        } catch (err) {
          console.warn("Could not fetch recent activity:", err.message);
          // Don't throw error for this, just use empty array
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

        console.log("Final metrics loaded successfully");
        console.log("Stats:", {
          totalChildren: parseInt(childrenStats.total_children) || 0,
          active: parseInt(childrenStats.active_children) || 0,
          inactive: parseInt(childrenStats.inactive_children) || 0,
        });

      } catch (err) {
        console.error("Error in fetchParentMetrics:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load dashboard data";
        setError(errorMessage);
        
        // Reset on error but don't clear everything
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