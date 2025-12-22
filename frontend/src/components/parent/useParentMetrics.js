import { useEffect, useState } from "react";
import { transformChildrenActivityToChartData } from './../../utils/activityDataTransformer';
import {dashboardApi} from '../../services/childActivity'

// useParentMetrics.js
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

        const [childrenActivityResponse, recentActivityResponse, childrenStatsResponse] = await Promise.allSettled([
          dashboardApi.getChildrenActivity(parentId),
          dashboardApi.getRecentActivity(parentId),
          dashboardApi.getChildrenStats(parentId)
        ]);

        // Process children activity data (this seems to work fine)
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
          }
        }

        // FIXED: Process children stats data with correct field mapping
        if (childrenStatsResponse.status === 'fulfilled') {
          const statsData = childrenStatsResponse.value?.data?.data || {};
          
          
          setStats(prev => ({
            ...prev,
            
            totalChildren: parseInt(statsData.total_children) || 0,
            active: parseInt(statsData.active_children) || 0,
            inactive: parseInt(statsData.inactive_children) || 0,
            
            activeSubscriptions: prev.activeSubscriptions, // Keep existing or set to 0
            newSignups: prev.newSignups, // Keep existing or set to 0
            openTickets: prev.openTickets // Keep existing or set to 0
          }));
        } else {
          console.warn("Failed to fetch children stats:", childrenStatsResponse.reason);
        }

        // Process recent activity data
        if (recentActivityResponse.status === 'fulfilled') {
          const timelineData = recentActivityResponse.value?.data?.data || [];
          setTimeline(timelineData);
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