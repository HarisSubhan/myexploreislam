import React, {
  useMemo,
  useState,
  useId,
  useRef,
  useLayoutEffect,
} from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Spinner, ButtonGroup, Button } from "react-bootstrap";

const COLOR_PALETTE = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FECA57",
  "#FF9FF3",
  "#54A0FF",
  "#5F27CD",
  "#00D2D3",
  "#FF9F43",
  "#10AC84",
  "#EE5A24",
];

// Error boundary for chart
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || "Chart render failed." };
  }
  componentDidCatch(err, info) {
    console.error("MultiChildChart internal error:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-danger small py-4 text-center">
          {this.state.message} – try changing the chart type or refresh.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Hook to ensure we only render the chart once we have a non-zero width.
 */
function useNonZeroSize() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    function check() {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        setReady(true);
      }
    }
    check();

    const ro = new ResizeObserver(() => check());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, ready];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white border rounded p-2 shadow-sm">
        <p className="fw-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="mb-0 small" style={{ color: entry.color }}>
            {entry.name}: {entry.value} minutes
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MultiChildChart({
  data = [],
  loading = false,
  chartType = "line",
  stacked = true,
  showTypeSwitcher = false,
  height = 320,
  className = "",
  yLabel = "Minutes",
}) {
  const [internalType, setInternalType] = useState(chartType);
  const activeType = showTypeSwitcher ? internalType : chartType;
  const instanceId = useId();

  const safeData = Array.isArray(data) ? data : [];

  // Format dates for better display and ensure numeric values
  const formattedData = useMemo(() => {
    return safeData.map((item) => {
      const formatted = { ...item };

      // Ensure all child values are numbers
      Object.keys(formatted).forEach((key) => {
        if (key !== "date" && typeof formatted[key] !== "number") {
          formatted[key] = Number(formatted[key]) || 0;
        }
      });

      // Format date to be more readable
      if (formatted.date) {
        try {
          const date = new Date(formatted.date);
          if (!isNaN(date)) {
            formatted.date = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }
        } catch (e) {
          console.warn("Invalid date format:", formatted.date);
        }
      }
      return formatted;
    });
  }, [safeData]);

  const firstRow = formattedData.length > 0 ? formattedData[0] : {};

  const childKeys = useMemo(() => {
    return Object.keys(firstRow).filter(
      (k) => k !== "date" && typeof firstRow[k] === "number"
    );
  }, [firstRow]);

  console.log("MultiChildChart formatted data:", formattedData);
  console.log("MultiChildChart childKeys:", childKeys);

  const [outerRef, hasSize] = useNonZeroSize();

  const noValidData =
    (!loading && formattedData.length === 0) || childKeys.length === 0;

  // Fallback demo data
  const demoData = [
    { date: "Mon", "John Doe": 40, "Sarah Smith": 25, "Adam Johnson": 35 },
    { date: "Tue", "John Doe": 50, "Sarah Smith": 30, "Adam Johnson": 20 },
    { date: "Wed", "John Doe": 20, "Sarah Smith": 45, "Adam Johnson": 25 },
    { date: "Thu", "John Doe": 30, "Sarah Smith": 35, "Adam Johnson": 40 },
    { date: "Fri", "John Doe": 25, "Sarah Smith": 50, "Adam Johnson": 30 },
    { date: "Sat", "John Doe": 45, "Sarah Smith": 20, "Adam Johnson": 35 },
    { date: "Sun", "John Doe": 35, "Sarah Smith": 40, "Adam Johnson": 45 },
  ];

  const displayData = noValidData && !loading ? demoData : formattedData;
  const displayChildKeys =
    noValidData && !loading
      ? ["John Doe", "Sarah Smith", "Adam Johnson"]
      : childKeys;

  if (noValidData && !loading) {
    return (
      <Card className={`shadow-sm h-100 ${className}`}>
        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
            <h6 className="mb-0 fw-semibold">Children Activity ({yLabel})</h6>
            <div className="text-warning small">Showing demo data</div>
          </div>
          <div
            ref={outerRef}
            style={{ width: "100%", height }}
            className="position-relative"
          >
            {hasSize && (
              <ChartErrorBoundary>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={displayData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {displayChildKeys.map((k, i) => (
                      <Area
                        key={k}
                        type="monotone"
                        dataKey={k}
                        stroke={COLOR_PALETTE[i % COLOR_PALETTE.length]}
                        fill={`url(#grad-${instanceId}-${k})`}
                        strokeWidth={2}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                    <defs>
                      {displayChildKeys.map((k, i) => {
                        const color = COLOR_PALETTE[i % COLOR_PALETTE.length];
                        return (
                          <linearGradient
                            key={k}
                            id={`grad-${instanceId}-${k}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={color}
                              stopOpacity={0.75}
                            />
                            <stop
                              offset="95%"
                              stopColor={color}
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                        );
                      })}
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartErrorBoundary>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  }

  const showChart = !loading && hasSize;

  // Build the chart element
  const chartElement = useMemo(() => {
    if (loading) return null;

    const common = {
      data: displayData,
      margin: { top: 10, right: 20, left: 0, bottom: 5 },
    };

    const renderLegend = displayChildKeys.length > 0 ? <Legend /> : null;

    switch (activeType) {
      case "line":
        return (
          <LineChart {...common} key={`line-${displayChildKeys.join("-")}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            {renderLegend}
            {displayChildKeys.map((k, i) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={COLOR_PALETTE[i % COLOR_PALETTE.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...common} key={`area-${displayChildKeys.join("-")}`}>
            <defs>
              {displayChildKeys.map((k, i) => {
                const color = COLOR_PALETTE[i % COLOR_PALETTE.length];
                return (
                  <linearGradient
                    key={k}
                    id={`grad-${instanceId}-${k}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.75} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            {renderLegend}
            {displayChildKeys.map((k, i) => {
              const color = COLOR_PALETTE[i % COLOR_PALETTE.length];
              return (
                <Area
                  key={k}
                  type="monotone"
                  dataKey={k}
                  stroke={color}
                  fill={`url(#grad-${instanceId}-${k})`}
                  strokeWidth={2}
                  activeDot={{ r: 5 }}
                />
              );
            })}
          </AreaChart>
        );
      case "groupedBar":
        return (
          <BarChart {...common} key={`gbar-${displayChildKeys.join("-")}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            {renderLegend}
            {displayChildKeys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                fill={COLOR_PALETTE[i % COLOR_PALETTE.length]}
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
              />
            ))}
          </BarChart>
        );
      case "stackedBar":
        return (
          <BarChart {...common} key={`sbar-${displayChildKeys.join("-")}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            {renderLegend}
            {displayChildKeys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                stackId={stacked ? "stack" : undefined}
                fill={COLOR_PALETTE[i % COLOR_PALETTE.length]}
                radius={
                  stacked && i === displayChildKeys.length - 1
                    ? [6, 6, 0, 0]
                    : 0
                }
                maxBarSize={55}
              />
            ))}
          </BarChart>
        );
      default:
        return null;
    }
  }, [activeType, displayData, displayChildKeys, instanceId, stacked, loading]);

  return (
    <Card className={`shadow-sm h-100 ${className}`}>
      <Card.Body className="d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
          <h6 className="mb-0 fw-semibold">Children Activity ({yLabel})</h6>
          <div className="d-flex align-items-center gap-2">
            {loading && <Spinner animation="border" size="sm" />}
            {showTypeSwitcher && (
              <ButtonGroup size="sm">
                {["line", "area", "groupedBar", "stackedBar"].map((t) => (
                  <Button
                    key={t}
                    variant={t === activeType ? "primary" : "outline-primary"}
                    onClick={() => setInternalType(t)}
                  >
                    {t === "groupedBar"
                      ? "Grouped"
                      : t === "stackedBar"
                        ? "Stacked"
                        : t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </ButtonGroup>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={outerRef}
          style={{ width: "100%", height }}
          className="position-relative"
        >
          {loading && (
            <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted small">
              <Spinner animation="border" className="mb-2" />
              Loading activity…
            </div>
          )}

          {!loading && !hasSize && (
            <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted small">
              Measuring container…
            </div>
          )}

          {!loading && hasSize && (
            <ChartErrorBoundary>
              <ResponsiveContainer width="100%" height="100%">
                {chartElement}
              </ResponsiveContainer>
            </ChartErrorBoundary>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
