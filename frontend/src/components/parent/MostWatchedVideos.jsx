import React, { useMemo, useState, useId } from "react";
import { Card, ButtonGroup, Button, Dropdown } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  LabelList,
  Cell
} from "recharts";
import { IoSwapVertical, IoOptions, IoBarChart, IoTime } from "react-icons/io5";

export default function MostWatchedVideos({
  data = [],
  loading = false,
  metricOptions = [
    { key: "views", label: "Views", icon: <IoBarChart /> },
    { key: "watchTime", label: "Watch Time (min)", icon: <IoTime /> }
  ],
  defaultMetric = "views",
  palette = ["#3b82f6", "#6366f1", "#0ea5e9", "#059669", "#f59e0b", "#dc2626"],
  height = 340
}) {
  const [metric, setMetric] = useState(defaultMetric);
  const [ascending, setAscending] = useState(false);
  const chartId = useId();


  const { sorted, totalMetric } = useMemo(() => {
    const safe = Array.isArray(data) ? data.slice() : [];
    const total = safe.reduce((a, d) => a + (Number(d[metric]) || 0), 0);
    safe.sort((a, b) =>
      ascending
        ? (a[metric] || 0) - (b[metric] || 0)
        : (b[metric] || 0) - (a[metric] || 0)
    );
    return { sorted: safe, totalMetric: total };
  }, [data, metric, ascending]);

  const placeholder = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        video: "Loading...",
        [metric]: 0
      })),
    [metric]
  );

  const activeMetricConfig = metricOptions.find((m) => m.key === metric) || {
    key: metric,
    label: metric
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const datum = payload[0].payload;
    const rawValue = datum[metric] || 0;
    const share =
      totalMetric > 0 ? ((rawValue / totalMetric) * 100).toFixed(1) : 0;
    return (
      <div
        className="p-2 rounded-3 shadow-sm"
        style={{
          background: "#ffffffee",
          border: "1px solid #e5e7eb",
          minWidth: 180
        }}
      >
        <div className="fw-semibold mb-1">{label}</div>
        <div className="small">
          <span className="text-muted">{activeMetricConfig.label}:</span>{" "}
          <strong>{rawValue}</strong>
        </div>
        <div className="small">
          <span className="text-muted">Share:</span>{" "}
          <strong>{share}%</strong>
        </div>
      </div>
    );
  };

  // Bar label content
  const valueFormatter = (value) => value ?? 0;

  // Empty state
  const isEmpty = !loading && sorted.length === 0;

  return (
    <Card className="pd-card h-100" aria-labelledby={`mwv-title-${chartId}`}>
      <div className="chart-card-header px-3 pt-3">
        <h5 id={`mwv-title-${chartId}`} className="section-title mb-0 d-flex align-items-center gap-2">
          Most Watched Videos
        </h5>

        {/* Toolbar */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Metric Selector */}
            <Dropdown>
              <Dropdown.Toggle
                size="sm"
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
                aria-label="Select metric"
              >
                <IoOptions />
                <span style={{ fontSize: ".75rem" }}>{activeMetricConfig.label}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {metricOptions.map((opt) => (
                  <Dropdown.Item
                    key={opt.key}
                    active={opt.key === metric}
                    onClick={() => setMetric(opt.key)}
                    className="d-flex align-items-center gap-2"
                  >
                    {opt.icon}
                    {opt.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

          {/* Sort Toggle */}
          <Button
            size="sm"
            variant="outline-secondary"
            className="d-flex align-items-center gap-1"
            onClick={() => setAscending((s) => !s)}
            aria-pressed={ascending}
            aria-label="Toggle sort direction"
          >
            <IoSwapVertical />
            <span style={{ fontSize: ".7rem" }}>
              {ascending ? "Ascending" : "Descending"}
            </span>
          </Button>
        </div>
      </div>

      <div
        className="px-3 pb-3 chart-wrapper position-relative"
        style={{ height }}
        role="region"
        aria-label="Most watched videos chart"
      >
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 p-2">
            <SkeletonRows rows={4} />
          </div>
        )}

        {isEmpty ? (
          <EmptyState message="No video watch data available for the selected range." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={loading ? placeholder : sorted}
              layout="vertical"
              margin={{ left: 50, right: 12, top: 10, bottom: 10 }}
              barCategoryGap={12}
            >
              <defs>
                {sorted.map((d, i) => {
                  const color = palette[i % palette.length];
                  return (
                    <linearGradient
                      key={i}
                      id={`grad-${chartId}-${i}`}
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="0"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.95} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="video"
                type="category"
                width={140}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v, idx) =>
                  `${String(idx + 1).padStart(2, "0")}. ${v}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={activeMetricConfig.key}
                isAnimationActive={!loading}
                radius={[6, 6, 6, 6]}
              >
                {(loading ? placeholder : sorted).map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={`url(#grad-${chartId}-${i})`}
                    stroke={palette[i % palette.length]}
                    strokeWidth={1}
                  />
                ))}
                <LabelList
                  dataKey={activeMetricConfig.key}
                  position="right"
                  formatter={valueFormatter}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fill: "#111827"
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Footer Summary */}
        {!loading && !isEmpty && (
          <div
            className="small text-muted mt-2 position-absolute bottom-0 start-0 ps-3 pb-2"
            style={{ fontSize: ".7rem" }}
          >
            Total {activeMetricConfig.label}:{" "}
            <strong>{totalMetric}</strong>
          </div>
        )}
      </div>
    </Card>
  );
}



function SkeletonRows({ rows = 4 }) {
  return (
    <div className="d-flex flex-column h-100 justify-content-around">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
            className="skeleton"
          style={{
            height: "46px",
            borderRadius: "10px"
          }}
        />
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div
      className="w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center px-3"
      style={{ opacity: 0.8 }}
    >
      <div
        style={{
          fontSize: "2.5rem",
          lineHeight: 1,
          filter: "grayscale(30%)"
        }}
      >
        📊
      </div>
      <p className="mb-0 mt-2 small fw-semibold">{message}</p>
    </div>
  );
}
