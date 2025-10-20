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
