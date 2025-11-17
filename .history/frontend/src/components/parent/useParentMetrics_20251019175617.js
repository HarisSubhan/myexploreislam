// components/parent/useParentMetrics.js
import { useState, useEffect } from "react";
import { dashboardApi, mockData } from "../../services/dashboardApi";

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

        // Use Promise.all to fetch multiple endpoints in parallel
        const [
          statsResponse,
          activityResponse,
          childrenResponse,
          timelineResponse,
          subscriptionResponse,
        ] = await Promise.allSettled([
          dashboardApi.getChildrenStats(parentId),
          dashboardApi.getCombinedActivity(parentId, range),
          dashboardApi.getChildren(parentId),
          dashboardApi.getTimeline(parentId),
          dashboardApi.getSubscription(parentId),
        ]);

        // Process stats response
        if (
          statsResponse.status === "fulfilled" &&
          statsResponse.value.data?.data
        ) {
          const statsData = statsResponse.value.data.data;
          setStats({
            totalChildren: statsData.total_children || 0,
            active: statsData.active_children || 0,
            inactive: statsData.inactive_children || 0,
          });
        } else {
          // Fallback to mock data or handle error
          console.warn("Stats API failed, using mock data");
          setStats({
            totalChildren: 3,
            active: 2,
            inactive: 1,
          });
        }

        // Process activity response
        if (activityResponse.status === "fulfilled") {
          setCombinedActivity(activityResponse.value.data?.data || []);
        } else {
          setCombinedActivity(mockData.generateActivityData(range));
        }

        // Process children response
        if (childrenResponse.status === "fulfilled") {
          setChildren(childrenResponse.value.data?.data || []);
        } else {
          setChildren(mockData.generateChildrenData());
        }

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

        // Fallback to mock data on complete failure
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
