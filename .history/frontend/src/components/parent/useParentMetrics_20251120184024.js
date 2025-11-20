// useParentMetrics.js
import { useState, useEffect } from "react";
import { dashboardApi } from "";
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
      // Don't fetch if no parentId
      if (!parentId) {
        setLoading(false);
        setError("No parent ID provided");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch data with error handling for each request
        let childrenActivityResponse = null;
        let recentActivityResponse = null;
        let childrenStatsResponse = null;

        try {
          childrenActivityResponse =
            await dashboardApi.getChildrenActivity(parentId);
        } catch (err) {
          console.warn("Could not fetch children activity:", err.message);
          childrenActivityResponse = { data: { data: [] } };
        }

        try {
          recentActivityResponse =
            await dashboardApi.getRecentActivity(parentId);
        } catch (err) {
          console.warn("Could not fetch recent activity:", err.message);
          recentActivityResponse = { data: { data: [] } };
        }

        try {
          childrenStatsResponse =
            await dashboardApi.getChildrenStats(parentId);
        } catch (err) {
          console.warn("Could not fetch children stats:", err.message);
          childrenStatsResponse = { data: { data: {} } };
        }

        // Process children activity data
        const childrenData = childrenActivityResponse?.data?.data || [];

        if (childrenData.length > 0) {
          // Transform the data for the chart
          const chartData = transformChildrenActivityToChartData(childrenData);
          setCombinedActivity(chartData);

          // Set children data
          setChildren(childrenData);

          // Update stats from children data
          const totalChildren = childrenData.length;
          const active = childrenData.filter(
            (child) => (child.total_active_minutes || 0) > 0
          ).length;

          setStats(prevStats => ({
            ...prevStats,
            totalChildren,
            active,
            inactive: totalChildren - active,
          }));
        } else {
          // No children data
          setCombinedActivity([]);
          setChildren([]);
          setStats(prevStats => ({
            ...prevStats,
            totalChildren: 0,
            active: 0,
            inactive: 0,
          }));
        }

        // Process children stats data
        const statsData = childrenStatsResponse?.data?.data || {};
        setStats(prevStats => ({
          ...prevStats,
          activeSubscriptions: statsData.active_subscriptions_7days || 0,
          newSignups: statsData.new_signups_7days || 0,
          openTickets: statsData.open_tickets_7days || 0
        }));

        // Process recent activity data
        const timelineData = recentActivityResponse?.data?.data || [];
        setTimeline(timelineData);
      } catch (err) {
        console.error("Error in fetchParentMetrics:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );

        // Set empty states on error
        setStats({
          totalChildren: 0,
          active: 0,
          inactive: 0,
          activeSubscriptions: 0,
          newSignups: 0,
          openTickets: 0
        });
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