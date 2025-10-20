// MultiChildChart.jsx
import React, { useState, useMemo } from "react";
import { Card } from "react-bootstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MultiChildChart = ({
  showTypeSwitcher = true,
  chartType = "area",
  data = [],
  loading = false,
  height = 340,
  yLabel = "Minutes",
}) => {

  const [currentChartType, setCurrentChartType] = useState(chartType);

  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  
  const childKeys = useMemo(() => {
    if (!chartData.length) return [];

    
    const keys = Object.keys(chartData[0] || {}).filter(
      (key) => key !== "date" && key !== "name"
    );
    return keys;
  }, [chartData]);

 

  // Colors for different children
  const colors = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#14b8a6",
  ];

  if (loading) {
    return (
      <Card className="pd-card h-100">
        <Card.Body>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: `${height}px` }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading chart...</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="pd-card h-100">
        <Card.Body>
          <div
            className="d-flex justify-content-center align-items-center flex-column"
            style={{ height: `${height}px` }}
          >
            <div className="text-muted mb-2">No activity data available</div>
            <small className="text-muted">
              Add children or wait for activity data to appear
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="pd-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">Children Activity Overview</Card.Title>
          {showTypeSwitcher && (
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${currentChartType === "area" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setCurrentChartType("area")}
              >
                Area
              </button>
              <button
                type="button"
                className={`btn ${currentChartType === "line" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setCurrentChartType("line")}
              >
                Line
              </button>
            </div>
          )}
        </div>

        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            {currentChartType === "area" ? (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6c757d" }}
                  axisLine={{ stroke: "#dee2e6" }}
                />
                <YAxis
                  tick={{ fill: "#6c757d" }}
                  axisLine={{ stroke: "#dee2e6" }}
                  label={{
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "#6c757d" },
                  }}
                />
                <Tooltip />
                <Legend />
                {childKeys.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.6}
                    name={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  />
                ))}
              </AreaChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6c757d" }}
                  axisLine={{ stroke: "#dee2e6" }}
                />
                <YAxis
                  tick={{ fill: "#6c757d" }}
                  axisLine={{ stroke: "#dee2e6" }}
                  label={{
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "#6c757d" },
                  }}
                />
                <Tooltip />
                <Legend />
                {childKeys.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.6}
                    name={key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MultiChildChart;
