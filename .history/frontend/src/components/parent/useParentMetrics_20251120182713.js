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
        setError("No parent ID provided");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel with individual error handling
        const [
          childrenStatsResponse,
          combinedActivityResponse,
          timelineResponse
        ] = await Promise.allSettled([
          dashboardApi.getChildrenStats(parentId),
          dashboardApi.getCombinedActivity(parentId, range),
          dashboardApi.getTimeline(parentId)
        ]);

        // Process children stats (for active/inactive counts)
        if (childrenStatsResponse.status === 'fulfilled') {
          const statsData = childrenStatsResponse.value?.data?.data || {};
          setStats({
            totalChildren: statsData.totalChildren || 0,
            active: statsData.active || 0,
            inactive: statsData.inactive || 0,
          });
        } else {
          console.warn("Could not fetch children stats:", childrenStatsResponse.reason.message);
          // Fallback to manual calculation if stats API fails
          await fetchStatsFallback();
        }

        // Process combined activity data
        if (combinedActivityResponse.status === 'fulfilled') {
          const activityData = combinedActivityResponse.value?.data?.data || [];
          if (activityData.length > 0) {
            const chartData = transformChildrenActivityToChartData(activityData);
            setCombinedActivity(chartData);
            setChildren(activityData);
          } else {
            setCombinedActivity([]);
            setChildren([]);
          }
        } else {
          console.warn("Could not fetch combined activity:", combinedActivityResponse.reason.message);
          setCombinedActivity([]);
          setChildren([]);
        }

        // Process timeline data
        if (timelineResponse.status === 'fulfilled') {
          const timelineData = timelineResponse.value?.data?.data || [];
          setTimeline(timelineData);
        } else {
          console.warn("Could not fetch timeline:", timelineResponse.reason.message);
          setTimeline([]);
        }

      } catch (err) {
        console.error("Error in fetchParentMetrics:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
        setEmptyStates();
      } finally {
        setLoading(false);
      }
    };

    // Fallback function to calculate stats from children data
    const fetchStatsFallback = async () => {
      try {
        const response = await dashboardApi.getCombinedActivity(parentId, range);
        const childrenData = response?.data?.data || [];
        
        const totalChildren = childrenData.length;
        const active = childrenData.filter(
          (child) => (child.total_active_minutes || 0) > 0
        ).length;

        setStats({
          totalChildren,
          active,
          inactive: totalChildren - active,
        });
      } catch (err) {
        console.warn("Fallback stats calculation also failed:", err);
        setStats({
          totalChildren: 0,
          active: 0,
          inactive: 0,
        });
      }
    };

    // Helper function to set empty states
    const setEmptyStates = () => {
      setStats({
        totalChildren: 0,
        active: 0,
        inactive: 0,
      });
      setCombinedActivity([]);
      setChildren([]);
      setTimeline([]);
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