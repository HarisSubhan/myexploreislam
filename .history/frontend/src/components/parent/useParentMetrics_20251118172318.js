import { useState, useEffect } from "react";
import { dashboardApi } from "../../services/dashboardApi";

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
  const [subscription, setSubscription] = useState(null);
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

        // Fetch all data in parallel
        const [childrenResponse, activityResponse, timelineResponse, subscriptionResponse] = await Promise.allSettled([
          dashboardApi.getChildren(parentId),
          dashboardApi.getCombinedActivity(parentId, range),
          dashboardApi.getTimeline(parentId),
          dashboardApi.getSubscription(parentId)
        ]);

        // Process children data
        if (childrenResponse.status === 'fulfilled') {
          const childrenData = childrenResponse.value?.data?.data || childrenResponse.value?.data || [];
          setChildren(childrenData);

          // Update stats
          const totalChildren = childrenData.length;
          const active = childrenData.filter(child => 
            child.status === 'active' || child.isActive || child.total_active_minutes > 0
          ).length;

          setStats({
            totalChildren,
            active,
            inactive: totalChildren - active,
          });
        } else {
          console.warn("Failed to fetch children:", childrenResponse.reason);
        }

        // Process activity data
        if (activityResponse.status === 'fulfilled') {
          const activityData = activityResponse.value?.data?.data || activityResponse.value?.data || [];
          setCombinedActivity(activityData);
        } else {
          console.warn("Failed to fetch activity:", activityResponse.reason);
        }

        // Process timeline data
        if (timelineResponse.status === 'fulfilled') {
          const timelineData = timelineResponse.value?.data?.data || timelineResponse.value?.data || [];
          setTimeline(timelineData);
        } else {
          console.warn("Failed to fetch timeline:", timelineResponse.reason);
        }

        // Process subscription data
        if (subscriptionResponse.status === 'fulfilled') {
          const subscriptionData = subscriptionResponse.value?.data?.data || subscriptionResponse.value?.data || null;
          setSubscription(subscriptionData);
        } else {
          console.warn("Failed to fetch subscription:", subscriptionResponse.reason);
        }

      } catch (err) {
        console.error("Error in fetchParentMetrics:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load dashboard data"
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
        setSubscription(null);
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