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
  ResponsiveContainer
} from "recharts";
import { Card, Spinner, ButtonGroup, Button } from "react-bootstrap";

const COLOR_PALETTE = [
  "#FFD166", "#06D6A0", "#F1066C", "#3A86FF", "#FB5607",
  "#FFD166", "#06D6A0", "#F1066C", "#3A86FF", "#FB5607",
  "#2d98da", "#45aaf2"
];

// Optional: keep for graceful fallback
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

export default function MultiChildChart({
  data = [],
  loading = false,
  chartType = "line",
  stacked = true,
  showTypeSwitcher = false,
  height = 320,
  className = ""
}) {
  const [internalType, setInternalType] = useState(chartType);
  const activeType = showTypeSwitcher ? internalType : chartType;
  const instanceId = useId();

  const safeData = Array.isArray(data) ? data : [];

  // Fallback demo data
  const demoData = [
    { date: "Mon", John: 40, Sarah: 25, Adam: 35 },
    { date: "Tue", John: 50, Sarah: 30, Adam: 20 },
    { date: "Wed", John: 20, Sarah: 45, Adam: 25 },
    { date: "Thu", John: 30, Sarah: 35, Adam: 40 },
    { date: "Fri", John: 25, Sarah: 50, Adam: 30 },
    { date: "Sat", John: 45, Sarah: 20, Adam: 35 },
    { date: "Sun", John: 35, Sarah: 40, Adam: 45 }
  ];

  const chartData = safeData.length > 0 ? safeData : demoData;
  const firstRow =
    chartData.length > 0 && typeof chartData[0] === "object" ? chartData[0] : {};

  const childKeys = useMemo(() => {
    return Object.keys(firstRow).filter(
      (k) => k !== "date" && typeof firstRow[k] === "number"
    );
  }, [firstRow]);

  console.log("MultiChildChart data:", chartData);
  console.log("MultiChildChart childKeys:", childKeys);

  const [outerRef, hasSize] = useNonZeroSize();

  const noValidData =
    (!loading && chartData.length === 0) || childKeys.length === 0;

  if (noValidData) {
    return (
      <Card className={`shadow-sm h-100 ${className}`}>
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <div className="text-muted small">No valid activity data available.</div>
        </Card.Body>
      </Card>
    );
  }

  const showChart = !loading && hasSize;

  // Build the chart element *once*, so ResponsiveContainer gets exactly one child.
  const chartElement = useMemo(() => {
    if (loading) return null;

    const common = {
      data: chartData,
      margin: { top: 10, right: 20, left: 0, bottom: 5 }
    };

    const renderLegend = childKeys.length > 0 ? <Legend /> : null;

    switch (activeType) {
      case "line":
        return (
          <LineChart {...common} key={`line-${childKeys.join("-")}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            {renderLegend}
            {childKeys.map((k, i) => (
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
          <AreaChart {...common} key={`area-${childKeys.join("-")}`}>
            <defs>
              {childKeys.map((k, i) => {
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
            <Tooltip />
            {renderLegend}
            {childKeys.map((k, i) => {
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
          <BarChart {...common} key={`gbar-${childKeys.join("-")}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            {renderLegend}
            {childKeys.map((k, i) => (
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
          <BarChart {...common} key={`sbar-${childKeys.join("-")}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            {renderLegend}
            {childKeys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                stackId={stacked ? "stack" : undefined}
                fill={COLOR_PALETTE[i % COLOR_PALETTE.length]}
                radius={
                  stacked && i === childKeys.length - 1 ? [6, 6, 0, 0] : 0
                }
                maxBarSize={55}
              />
            ))}
          </BarChart>
        );
      default:
        return null;
    }
  }, [activeType, chartData, childKeys, instanceId, stacked, loading]);

  return (
    <Card className={`shadow-sm h-100 ${className}`}>
      <Card.Body className="d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
          <h6 className="mb-0 fw-semibold">Children Activity (Minutes)</h6>
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
                      {t.replace(/([A-Z])/g, " $1")}
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
