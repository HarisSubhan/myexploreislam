import { useState, useEffect } from "react";

import { transformChildrenActivityToChartData } from "../../utils/activityDataTransformer";
import { dashboardApi } from "../../services/childActivity";

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

        // Fetch ONLY real children activity data
        const childrenActivityResponse =
          await dashboardApi.getChildrenActivity(parentId);

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

          console.log("Real API - Transformed chart data:", chartData);
          console.log("Real API - Children data:", childrenData);
        } else {
          throw new Error("No valid children activity data received from API");
        }

        // For timeline and subscription, set empty arrays/objects since we don't have APIs
        setTimeline([]);
        setSubscription({});
      } catch (err) {
        console.error("Error fetching parent metrics:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data from API"
        );

        // NO MOCK DATA FALLBACK - just set empty states
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
