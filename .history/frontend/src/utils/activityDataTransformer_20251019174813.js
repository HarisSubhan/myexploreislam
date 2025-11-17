/**
 * Transforms children activity API response to chart-compatible format
 * @param {Array} childrenData - API response data array
 * @returns {Array} Chart data in format [{ date: "2025-10-13", child1: 30, child2: 45 }, ...]
 */
export const transformChildrenActivityToChartData = (childrenData = []) => {
  if (!childrenData.length) return [];

  // Get all unique dates from all children's activities
  const allDates = new Set();
  childrenData.forEach((child) => {
    child.daily_activity?.forEach((activity) => {
      if (activity.date) {
        allDates.add(activity.date);
      }
    });
  });

  const sortedDates = Array.from(allDates).sort();

  // Create chart data structure
  const chartData = sortedDates.map((date) => {
    const dayData = { date };

    childrenData.forEach((child) => {
      // Create a safe key name from child's name
      const childName =
        child.name || child.username || `Child ${child.child_id}`;

      // Find activity for this date
      const dailyActivity = child.daily_activity?.find(
        (activity) => activity.date === date
      );

      dayData[childName] = dailyActivity?.minutes || 0;
    });

    return dayData;
  });

  return chartData;
};

/**
 * Alternative transformation that uses child IDs as keys
 */
export const transformChildrenActivityByChildId = (childrenData = []) => {
  if (!childrenData.length) return [];

  const chartData = [];
  const dateMap = new Map();

  childrenData.forEach((child) => {
    const childKey = `child_${child.child_id}`;
    const displayName =
      child.name || child.username || `Child ${child.child_id}`;

    child.daily_activity?.forEach((activity) => {
      if (!activity.date) return;

      if (!dateMap.has(activity.date)) {
        dateMap.set(activity.date, { date: activity.date });
      }

      const dayData = dateMap.get(activity.date);
      dayData[displayName] = activity.minutes || 0;
      // Also store child_id for reference if needed
      dayData[`${displayName}_id`] = child.child_id;
    });
  });

  // Convert map to array and sort by date
  return Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};
