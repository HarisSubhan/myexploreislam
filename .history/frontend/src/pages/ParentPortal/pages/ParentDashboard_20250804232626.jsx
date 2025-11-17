import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParentMetrics } from "../../../components/parent/useParentMetrics";
import DateRangeFilter from "../../../components/parent/DateRangeFilter";
import StatCards from "../../../components/parent/StatCards";
import SubscriptionWidget from "../../../components/parent/SubscriptionWidget";
import ActivityTimeline from "../../../components/parent/ActivityTimeline";
import ChildActivityTable from "../../../components/parent/ChildActivityTable";
import MultiChildChart from "../../../components/parent/MultiChildChart";
import "../../../components/parent/dashboardTheme.css";


const ParentDashboard = () => {
  const [range, setRange] = useState("7d");
  const {
    loading,
    stats,
    combinedActivity,
    children,
    timeline,
    subscription,
    error
  } = useParentMetrics(range);

  return (
    <div className="parent-dashboard">
      <Container fluid className="py-4">
        {/* Header & Date Range */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 gap-3">
          <h2 className="h4 mb-0 fw-semibold">Parent Dashboard</h2>
          <DateRangeFilter range={range} onChange={setRange} />
        </div>

        {/* Stat Cards */}
        <StatCards stats={stats} loading={loading} />

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger my-3" role="alert">
            Could not load metrics: {error}
          </div>
        )}

        {/* Multi Child Activity Chart */}
        <Row className="g-4 mt-1">
          <Col xs={12}>
            <MultiChildChart
              showTypeSwitcher
              chartType="area"
              data={combinedActivity}
              loading={loading}
              height={340}
              yLabel="Minutes"
            />
          </Col>
        </Row>

        {/* Widgets Row */}
        <Row className="g-4 mt-1">
          <Col xl={4} lg={6} md={6}>
            <SubscriptionWidget data={subscription} loading={loading} />
          </Col>
          <Col xl={8} lg={6} md={6}>
            <ActivityTimeline data={timeline} loading={loading} />
          </Col>
        </Row>

        {/* Children Activity Table */}
        <Row className="g-4 mt-1">
          <Col xs={12}>
            <ChildActivityTable data={children} loading={loading} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ParentDashboard;
