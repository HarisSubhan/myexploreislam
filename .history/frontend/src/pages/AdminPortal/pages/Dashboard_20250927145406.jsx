import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import {
  FaUsers, FaVideo, FaBook, FaQuestionCircle, FaBlogger
} from 'react-icons/fa';
import AdminLayout from '../AdminApp';
import axios from 'axios';
import IncomeChart from '../../../components/admin/IncomeChart';
import RecentActivity from "../../../components/admin/RecentActivity";
import UsersTable from "../../../components/admin/UsersTable";
import TopPerformingStudents from "../../../components/admin/TopPerformingStudents";
import HealthMetricCard from '../../../components/admin/HealthMetricCard';
import RevenueChart from '../../../components/admin/RevenueChart';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalParents: 0,
    totalChildren: 0,
    videos: 0,
    assignments: 0,
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

    useEffect(() => {
      // Simulate API fetch
      const fetchData = async () => {
        // Mock metrics data
        setMetrics({
          activeSubscriptions: 1247,
          subscriptionChange: 2.3,
          newSignups: 89,
          revenueThisMonth: 45280,
          churnRate: 1.2,
          openSupportTickets: 23,
        });

        // Mock revenue data for chart
        setRevenueData([
          { month: "Last Month", revenue: 42850 },
          { month: "This Month", revenue: 45280 },
        ]);
      };

      fetchData();
    }, []);

      const handleSupportTicketsClick = () => {
        // Navigate to support panel
        window.location.href = "/admin/support";
      };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats({
          totalParents: res.data.parents || 0,
          totalChildren: res.data.children || 0,
          videos: res.data.videos || 0,
          assignments: res.data.assignments || 0,
          quizzes: res.data.quizzes || 0,
          blogs: res.data.blogs || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    { label: 'Total Parents', value: stats.totalParents, icon: <FaUsers />, color: 'primary' },
    { label: 'Total Children', value: stats.totalChildren, icon: <FaUsers />, color: 'secondary' },
    { label: 'Total Videos', value: stats.videos, icon: <FaVideo />, color: 'info' },
    { label: 'Total Assignments', value: stats.assignments, icon: <FaBook />, color: 'success' },
    { label: 'Total Quizzes', value: stats.quizzes, icon: <FaQuestionCircle />, color: 'warning' },
    { label: 'Total Blogs', value: stats.blogs, icon: <FaBlogger />, color: 'danger' },
  ];

  return (
    <AdminLayout>
      <h2 className="mb-4 fw-bold"> Dashboard</h2>

      <Container fluid className="dashboard-container">
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">Platform Health Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time business metrics at a glance
            </p>
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          {/* Active Subscriptions */}
          <Col xs={12} md={6} lg={4}>
            <HealthMetricCard
              title="Active Subscriptions"
              value={metrics.activeSubscriptions.toLocaleString()}
              change={metrics.subscriptionChange}
              changeLabel="vs last 7 days"
              icon="👥"
              variant="primary"
            />
          </Col>

          {/* New Signups */}
          <Col xs={12} md={6} lg={4}>
            <HealthMetricCard
              title="New Signups (7d)"
              value={metrics.newSignups.toLocaleString()}
              change={12.5} // Example change
              changeLabel="this week"
              icon="📈"
              variant="success"
            />
          </Col>

          {/* Open Support Tickets */}
          <Col xs={12} md={6} lg={4}>
            <HealthMetricCard
              title="Open Support Tickets"
              value={metrics.openSupportTickets.toString()}
              change={-5.2} // Example change
              changeLabel="vs last week"
              icon="🎫"
              variant="warning"
              clickable={true}
              onClick={handleSupportTicketsClick}
            />
          </Col>
        </Row>

        <Row className="g-3">
          {/* Revenue This Month */}
          <Col xs={12} lg={8}>
            <Card className="h-100 revenue-card">
              <Card.Body>
                <RevenueChart
                  revenue={metrics.revenueThisMonth}
                  comparisonData={revenueData}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Churn Rate */}
          <Col xs={12} lg={4}>
            <HealthMetricCard
              title="Churn Rate"
              value={`${metrics.churnRate}%`}
              change={-0.3} // Example change
              changeLabel="vs last month"
              icon="📉"
              variant="danger"
              isPercentage={true}
            />
          </Col>
        </Row>
      </Container>

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
        {/* <Col md={6}> */}
        <TopPerformingStudents />
        {/* </Col> */}
      </Container>

      <Container className="mt-5">
        <UsersTable />
      </Container>
    </AdminLayout>
  );
};

export default Dashboard;
