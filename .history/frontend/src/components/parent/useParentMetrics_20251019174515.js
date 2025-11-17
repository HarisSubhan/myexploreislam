// components/parent/useParentMetrics.js
import { useState, useEffect } from "react";
import { dashboardApi, mockData } from "../../services/dashboardApi";
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

        // Fetch children activity data first
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
            (child) => child.total_active_minutes > 0
          ).length;

          setStats({
            totalChildren,
            active,
            inactive: totalChildren - active,
          });
        } else {
          throw new Error("Invalid children activity data");
        }

        // Fetch other data in parallel
        const [timelineResponse, subscriptionResponse] =
          await Promise.allSettled([
            dashboardApi.getTimeline(parentId),
            dashboardApi.getSubscription(parentId),
          ]);

        // Process timeline response
        if (timelineResponse.status === "fulfilled") {
          setTimeline(timelineResponse.value.data?.data || []);
        } else {
          setTimeline(mockData.generateTimelineData());
        }

        // Process subscription response
        if (subscriptionResponse.status === "fulfilled") {
          setSubscription(subscriptionResponse.value.data?.data || {});
        } else {
          setSubscription(mockData.generateSubscriptionData());
        }
      } catch (err) {
        console.error("Error fetching parent metrics:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );

        // Fallback to mock data
        setStats({
          totalChildren: 3,
          active: 2,
          inactive: 1,
        });
        setCombinedActivity(mockData.generateActivityData(range));
        setChildren(mockData.generateChildrenData());
        setTimeline(mockData.generateTimelineData());
        setSubscription(mockData.generateSubscriptionData());
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
