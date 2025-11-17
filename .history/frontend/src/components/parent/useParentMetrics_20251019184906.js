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
  const [subscription, setSubscription] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentMetrics = async () => {
      if (!parentId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch children activity data and recent activity in parallel
        const [childrenActivityResponse, recentActivityResponse] =
          await Promise.all([
            dashboardApi.getChildrenActivity(parentId),
            dashboardApi.getRecentActivity(parentId),
          ]);

        // Process children activity data
        if (
          childrenActivityResponse.status === 200 &&
          childrenActivityResponse.data?.data
        ) {
          const childrenData = childrenActivityResponse.data.data;

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

          setStats({
            totalChildren,
            active,
            inactive: totalChildren - active,
          });

        } else {
          throw new Error("No valid children activity data received from API");
        }

        // Process recent activity data
        if (
          recentActivityResponse.status === 200 &&
          recentActivityResponse.data?.data
        ) {
          setTimeline(recentActivityResponse.data.data);
          
        } else {
          setTimeline([]);
        }

        // For subscription, set empty object since we don't have API
        setSubscription({});
      } catch (err) {
        
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data from API"
        );

        // Set empty states on error
        setStats({
          totalChildren: 0,
          active: 0,
          inactive: 0,
        });
        setCombinedActivity([]);
        setChildren([]);
        setTimeline([]);
        setSubscription({});
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
    subscription,
    error,
  };
};
