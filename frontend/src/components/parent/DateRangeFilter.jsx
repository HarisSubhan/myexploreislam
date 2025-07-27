import React from "react";

export default function DateRangeFilter({ range, onChange }) {
  return (
    <div className="range-filter">
      <label className="visually-hidden" htmlFor="dateRangeSelect">
        Select date range
      </label>
      <select
        id="dateRangeSelect"
        value={range}
        onChange={e => onChange(e.target.value)}
        aria-label="Select date range"
      >
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
      </select>
    </div>
  );
}
