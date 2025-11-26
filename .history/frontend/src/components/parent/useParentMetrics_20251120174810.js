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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch children stats for active/inactive status
        const childrenStatsResponse = await dashboardApi.getChildrenStats(parentId);
        const childrenStats = childrenStatsResponse?.data?.data || {};
        
        // Update stats from children stats API
        setStats({
          totalChildren: childrenStats.total_children || 0,
          active: childrenStats.active_children || 0,
          inactive: childrenStats.inactive_children || 0,
        });

        // Fetch other data
        let childrenActivityResponse = null;
        let recentActivityResponse = null;

        try {
          childrenActivityResponse = await dashboardApi.getChildrenActivity(parentId);
        } catch (err) {
          console.warn("Could not fetch children activity:", err.message);
          childrenActivityResponse = { data: { data: [] } };
        }

        try {
          recentActivityResponse = await dashboardApi.getRecentActivity(parentId);
        } catch (err) {
          console.warn("Could not fetch recent activity:", err.message);
          recentActivityResponse = { data: { data: [] } };
        }

        // Process children activity data
        const childrenData = childrenActivityResponse?.data?.data || [];
        
        if (childrenData.length > 0) {
          const chartData = transformChildrenActivityToChartData(childrenData);
          setCombinedActivity(chartData);
          setChildren(childrenData);
        } else {
          setCombinedActivity([]);
          setChildren([]);
        }

        // Process recent activity data
        const timelineData = recentActivityResponse?.data?.data || [];
        setTimeline(timelineData);

      } catch (err) {
        console.error("Error in fetchParentMetrics:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
        
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