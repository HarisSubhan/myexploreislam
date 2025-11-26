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
import { useUser } from "../../../context/UserContext";

const ParentDashboard = () => {
  const [range, setRange] = useState("7d");
  const { user } = useUser(); 

 
  const parentId = user?.id; 

  const {
    loading,
    stats,
    combinedActivity,
    children,
    timeline,
    subscription,
    error,
  } = useParentMetrics(range, parentId);


  if (!user) {
    return (
      <div className="parent-dashboard">
        <Container fluid className="py-4">
          <div className="alert alert-warning" role="alert">
            Please log in to view the dashboard.
          </div>
        </Container>
      </div>
    );
  }

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
        
        {/* Empty State */}
        {!loading && !error && stats.totalChildren === 0 && (
          <div className="alert alert-info my-3" role="alert">
            <h5>Welcome to your Parent Dashboard!</h5>
            <p className="mb-0">
              You don't have any children added yet. Add children to start
              tracking their activity.
            </p>
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
        
      </Container>
    </div>
  );
};

export default ParentDashboard;
