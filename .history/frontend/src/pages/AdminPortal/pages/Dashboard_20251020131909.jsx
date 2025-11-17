import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  FaUsers,
  FaVideo,
  FaQuestionCircle,
  FaBlogger,
  FaCreditCard,
} from "react-icons/fa";
import AdminLayout from "../AdminApp";

import IncomeChart from "../../../components/admin/IncomeChart";
import RecentActivity from "../../../components/admin/RecentActivity";
import UsersTable from "../../../components/admin/UsersTable";
import TopPerformingStudents from "../../../components/admin/TopPerformingStudents";
import HealthMetricCard from "../../../components/admin/HealthMetricCard";
import LearningEngagementSection from "../../../components/admin/LearningEngagementSection";
import { dashboardAPI } from "../../../services/dashboardApi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalParents: 0,
    totalChildren: 0,
    videos: 0,
    subscription: 0,
    quizzes: 0,
    blogs: 0,
  });

  const [metrics, setMetrics] = useState({
    activeSubscriptions: 0,
    subscriptionChange: 0,
    newSignups: 0,
    revenueThisMonth: 0,
    churnRate: 0,
    openSupportTickets: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setMetricsLoading(true);

        // Fetch dashboard summary for HealthMetricCard data
        const summaryResponse = await dashboardAPI.getSummary();
        const summaryData = summaryResponse.data;

        // Update metrics with real API data
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          activeSubscriptions: summaryData.active_subscriptions_7days || 0,
          newSignups: summaryData.new_signups_7days || 0,
          openSupportTickets: summaryData.open_tickets_7days || 0,
        }));

        // Mock revenue data for chart (you can replace this with real API call if available)
        setRevenueData([
          { month: "Last Month", revenue: 42850 },
          { month: "This Month", revenue: 45280 },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await dashboardAPI.getStats();
        setStats({
          totalParents: statsResponse.parents || 0,
          totalChildren: statsResponse.children || 0,
          videos: statsResponse.videos || 0,
          subscription: statsResponse.subscriptions || 0,
          quizzes: statsResponse.quizzes || 0,
          blogs: statsResponse.blogs || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSupportTicketsClick = () => {
    window.location.href = "/admin/support";
  };

  const cardData = [
    {
      label: "Total Parents",
      value: stats.totalParents,
      icon: <FaUsers />,
      color: "primary",
    },
    {
      label: "Total Children",
      value: stats.totalChildren,
      icon: <FaUsers />,
      color: "secondary",
    },
    {
      label: "Total Videos",
      value: stats.videos,
      icon: <FaVideo />,
      color: "info",
    },
    {
      label: "Total Subscription",
      value: stats.subscription,
      icon: <FaCreditCard />,
      color: "success",
    },
    {
      label: "Total Quizzes",
      value: stats.quizzes,
      icon: <FaQuestionCircle />,
      color: "warning",
    },
    {
      label: "Total Blogs",
      value: stats.blogs,
      icon: <FaBlogger />,
      color: "danger",
    },
  ];

  return (
    <AdminLayout>
      <h2 className="mb-4 fw-bold"> Dashboard</h2>

      <Container fluid className="my-4">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-3">
            {cardData.map((item, index) => (
              <Col key={index} xs={12} md={6} lg={4}>
                <Card className="shadow-sm rounded-4 border-0 h-100 bg-light">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="h4 mb-1 fw-semibold">{item.value}</p>
                      <p className="mb-0 text-muted">{item.label}</p>
                    </div>
                    <div className={`fs-2 text-${item.color}`}>{item.icon}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Container fluid className="dashboard-container">
        <Row className="mb-4 p-5">
          
        </Row>

        <Row className="g-3 mb-4">
          {/* Active Subscriptions - Dynamic from API */}
          <Col xs={12} md={6} lg={4}>
            <HealthMetricCard
              title="Active Subscriptions (7d)"
              value={metrics.activeSubscriptions.toLocaleString()}
              change={metrics.subscriptionChange}
              changeLabel="vs last 7 days"
              icon="👥"
              variant="primary"
            />
          </Col>

          {/* New Signups - Dynamic from API */}
          <Col xs={12} md={6} lg={4}>
            <HealthMetricCard
              title="New Signups (7d)"
              value={metrics.newSignups.toLocaleString()}
              change={12.5} // You can make this dynamic too if API provides it
              changeLabel="this week"
              icon="📈"
              variant="success"
            />
          </Col>

          {/* Open Support Tickets - Dynamic from API */}
          <Col xs={12} md={6} lg={4}>
            <HealthMetricCard
              title="Open Support Tickets (7d)"
              value={metrics.openSupportTickets.toString()}
              change={-5.2} // You can make this dynamic too if API provides it
              changeLabel="vs last week"
              icon="🎫"
              variant="warning"
              clickable={true}
              onClick={handleSupportTicketsClick}
            />
          </Col>
        </Row>
      </Container>

      <Container className="mt-5 d-flex justify-content-between flex-wrap gap-4">
        <Card className="shadow-sm border-0" style={{ width: "70%" }}>
          <Card.Body>
            <h5 className="mb-4">Revenue Insights</h5>
            <IncomeChart />
          </Card.Body>
        </Card>

        <RecentActivity />
      </Container>

      <Container className="mt-4">
        <TopPerformingStudents />
      </Container>

      <Container className="mt-5">
        <UsersTable />
      </Container>

      {/* <LearningEngagementSection /> */}
    </AdminLayout>
  );
};

export default Dashboard;
