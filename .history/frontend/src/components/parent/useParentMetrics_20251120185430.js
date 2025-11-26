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
    activeSubscriptions: 0,
    newSignups: 0,
    openTickets: 0
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

        // Fetch all data in parallel for better performance
        const [childrenActivityResponse, recentActivityResponse, childrenStatsResponse] = await Promise.allSettled([
          dashboardApi.getChildrenActivity(parentId),
          dashboardApi.getRecentActivity(parentId),
          dashboardApi.getChildrenStats(parentId)
        ]);

        // Process children activity data
        if (childrenActivityResponse.status === 'fulfilled') {
          const childrenData = childrenActivityResponse.value?.data?.data || [];
          
          if (childrenData.length > 0) {
            const chartData = transformChildrenActivityToChartData(childrenData);
            setCombinedActivity(chartData);
            setChildren(childrenData);

            const totalChildren = childrenData.length;
            const active = childrenData.filter(
              (child) => (child.total_active_minutes || 0) > 0
            ).length;

            setStats(prev => ({
              ...prev,
              totalChildren,
              active,
              inactive: totalChildren - active,
            }));
          } else {
            setCombinedActivity([]);
            setChildren([]);
            setStats(prev => ({
              ...prev,
              totalChildren: 0,
              active: 0,
              inactive: 0,
            }));
          }
        } else {
          console.warn("Failed to fetch children activity:", childrenActivityResponse.reason);
        }

        // Process children stats data
        if (childrenStatsResponse.status === 'fulfilled') {
          const statsData = childrenStatsResponse.value?.data?.data || {};
          setStats(prev => ({
            ...prev,
            activeSubscriptions: statsData.active_subscriptions_7days || 0,
            newSignups: statsData.new_signups_7days || 0,
            openTickets: statsData.open_tickets_7days || 0
          }));
        } else {
          console.warn("Failed to fetch children stats:", childrenStatsResponse.reason);
        }

        // Process recent activity data
        if (recentActivityResponse.status === 'fulfilled') {
          const timelineData = recentActivityResponse.value?.data?.data || [];
          setTimeline(timelineData);
        } else {
          console.warn("Failed to fetch recent activity:", recentActivityResponse.reason);
        }

      } catch (err) {
        console.error("Unexpected error in fetchParentMetrics:", err);
        setError("Failed to load dashboard data");
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