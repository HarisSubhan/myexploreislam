import { useEffect, useState } from "react";

export function useParentMetrics(range = "7d") {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalChildren: 0, active: 0, inactive: 0 });
  const [children, setChildren] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [combinedActivity, setCombinedActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (cancelled) return;

      try {
        const baseDays = range === "30d" ? 30 : 7;
        const now = Date.now();

        const makeSeries = () =>
          Array.from({ length: baseDays }, (_, i) => {
            const dayTs = now - (baseDays - 1 - i) * 86400000;
            return {
              dateLabel: new Date(dayTs).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
              weekday: new Date(dayTs).toLocaleDateString(undefined, { weekday: "short" }),
              minutes: Math.round(10 + Math.random() * 50)
            };
          });

        /** --- Demo Children --- */
        const childRows = [
          { id: 1, name: "John", video: "Math Basics", status: "Watching", lastActive: "2 min ago" },
          { id: 2, name: "Sarah", video: "Cartoon Story", status: "Idle", lastActive: "10 min ago" },
          { id: 3, name: "Adam", video: "Science Experiment", status: "Watching", lastActive: "5 min ago" }
        ];

        /** --- Demo Series --- */
        const childSeries = {
          John: makeSeries(),
          Sarah: makeSeries(),
          Adam: makeSeries()
        };

       const combined = Array.from({ length: baseDays }, (_, i) => ({
  date: childSeries.John[i].weekday,
  John: childSeries.John[i].minutes,
  Sarah: childSeries.Sarah[i].minutes,
  Adam: childSeries.Adam[i].minutes
}));


        /** --- Demo Timeline --- */
        const timeEvents = [
          { type: "watch", text: "John started Math Basics", time: "5 mins ago" },
          { type: "login", text: "Sarah logged in", time: "15 mins ago" },
          { type: "logout", text: "Adam logged out", time: "20 mins ago" },
          { type: "watch", text: "Adam resumed Science Experiment", time: "25 mins ago" }
        ];

        /** --- Demo Subscription --- */
        const subscriptionMeta = {
          plan: "Premium",
          daysUsed: 18,
          totalDays: 30,
          renewalDate: new Date(now + 12 * 86400000).toLocaleDateString()
        };

        setStats({ totalChildren: 3, active: 2, inactive: 1 });
        setChildren(childRows);
        setCombinedActivity(combined);
        setTimeline(timeEvents);
        setSubscription(subscriptionMeta);
        setLoading(false);
      } catch (e) {
        setError(e.message || "Unknown error");
        setLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [range]);

  return {
    loading,
    stats,
    combinedActivity,
    children,
    timeline,
    subscription,
    error
  };
}
