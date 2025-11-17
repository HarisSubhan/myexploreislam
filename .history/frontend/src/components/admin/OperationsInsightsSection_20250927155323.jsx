import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Tab, Nav } from "react-bootstrap";
import RevenueBreakdown from "./RevenueBreakdown";
import OperationalAlerts from "./OperationalAlerts";
import ActivityFeed from "./ActivityFeed";


const OperationsInsightsSection = () => {
  const [revenueData, setRevenueData] = useState({
    byPlan: [],
    byCohort: [],
    refunds: 0,
    failedPayments: 0,
  });

  const [alertsData, setAlertsData] = useState({
    contentPending: [],
    systemErrors: [],
    complianceAlerts: [],
  });

  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const fetchData = async () => {
      setRevenueData({
        byPlan: [
          { plan: "Basic", revenue: 15200, percentage: 33.6, change: 2.1 },
          { plan: "Premium", revenue: 24800, percentage: 54.8, change: 5.3 },
          { plan: "Family", revenue: 5280, percentage: 11.6, change: -1.2 },
        ],
        byCohort: [
          { cohort: "This Month", revenue: 45280, users: 89, arpu: 508.76 },
          { cohort: "Last Month", revenue: 42850, users: 76, arpu: 563.82 },
          { cohort: "2 Months Ago", revenue: 39500, users: 82, arpu: 481.7 },
        ],
        refunds: 1250,
        failedPayments: 870,
      });

      setAlertsData({
        contentPending: [
          {
            id: 1,
            title: "Advanced Math Quiz",
            type: "Quiz",
            author: "Dr. Smith",
            waitingDays: 3,
          },
          {
            id: 2,
            title: "Science Experiment Video",
            type: "Video",
            author: "Prof. Johnson",
            waitingDays: 2,
          },
          {
            id: 3,
            title: "Creative Writing Course",
            type: "Course",
            author: "Ms. Davis",
            waitingDays: 5,
          },
        ],
        systemErrors: [
          {
            id: 1,
            type: "Video Transcoding",
            severity: "high",
            count: 12,
            lastOccurred: "2 hours ago",
          },
          {
            id: 2,
            type: "Email Bounce",
            severity: "medium",
            count: 45,
            lastOccurred: "30 minutes ago",
          },
          {
            id: 3,
            type: "API Rate Limit",
            severity: "medium",
            count: 8,
            lastOccurred: "1 hour ago",
          },
          {
            id: 4,
            type: "Payment Gateway",
            severity: "high",
            count: 3,
            lastOccurred: "15 minutes ago",
          },
        ],
        complianceAlerts: [
          {
            id: 1,
            type: "Consent Missing",
            users: 23,
            priority: "high",
            age: 7,
          },
          {
            id: 2,
            type: "Flagged Account",
            users: 5,
            priority: "critical",
            age: 1,
          },
          {
            id: 3,
            type: "Data Export Request",
            users: 3,
            priority: "medium",
            age: 3,
          },
        ],
      });

      setActivityData([
        {
          id: 1,
          type: "learning",
          action: "quiz_completed",
          user: "Emma Johnson",
          target: "Math Fundamentals Quiz",
          score: 92,
          timestamp: new Date(Date.now() - 300000),
          details: { course: "Mathematics Grade 5", timeSpent: "15m 23s" },
        },
        {
          id: 2,
          type: "billing",
          action: "subscription_upgraded",
          user: "Michael Chen",
          target: "Premium Plan",
          amount: 29.99,
          timestamp: new Date(Date.now() - 900000),
          details: { fromPlan: "Basic", toPlan: "Premium" },
        },
        {
          id: 3,
          type: "support",
          action: "ticket_created",
          user: "Sarah Williams",
          target: "Video playback issue",
          priority: "medium",
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          id: 4,
          type: "learning",
          action: "course_completed",
          user: "Alex Rodriguez",
          target: "Science Experiments",
          score: 88,
          timestamp: new Date(Date.now() - 3600000),
          details: { duration: "2 weeks 3 days", finalGrade: "A-" },
        },
        {
          id: 5,
          type: "billing",
          action: "payment_failed",
          user: "David Kim",
          target: "Basic Plan",
          amount: 14.99,
          timestamp: new Date(Date.now() - 7200000),
          details: { retryAttempt: 2, nextRetry: "24 hours" },
        },
      ]);
    };

    fetchData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      // In real implementation, this would fetch new data
      console.log("Checking for new operational data...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="operations-insights-section">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">Operations & Deep Insights</h2>
          <p className="section-subtitle">
            Platform stability, revenue analytics, and real-time monitoring
          </p>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="revenue">
        <Card>
          <Card.Header>
            <Nav variant="tabs" className="section-tabs">
              <Nav.Item>
                <Nav.Link eventKey="revenue">Revenue Breakdown</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="alerts">
                  Operational Alerts
                  {getTotalAlerts(alertsData) > 0 && (
                    <span className="alert-badge">
                      {getTotalAlerts(alertsData)}
                    </span>
                  )}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="activity">Recent Activity</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="revenue">
                <RevenueBreakdown data={revenueData} />
              </Tab.Pane>

              <Tab.Pane eventKey="alerts">
                <OperationalAlerts data={alertsData} />
              </Tab.Pane>

              <Tab.Pane eventKey="activity">
                <ActivityFeed data={activityData} />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
};

// Helper function to count total alerts
const getTotalAlerts = (alertsData) => {
  return (
    alertsData.contentPending.length +
    alertsData.systemErrors.length +
    alertsData.complianceAlerts.length
  );
};

export default OperationsInsightsSection;
