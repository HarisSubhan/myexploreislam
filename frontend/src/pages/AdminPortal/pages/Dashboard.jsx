import React, { useEffect, useState } from 'react';
import StatCard from '../../../components/admin/StatCard';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaVideo, FaBook, FaQuestionCircle } from 'react-icons/fa';
import AdminLayout from "../AdminApp";
import axios from 'axios';
import IncomeChart from "../../../components/admin/IncomeChart";

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    videos: 0,
    assignments: 0,
    quizzes: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token'); // 👈 ya jahan bhi aap token store kar rahay hain
        const res = await axios.get('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats({
          totalUsers: res.data.totalUsers || 0,
          videos: res.data.videos || 0,
          assignments: res.data.assignments || 0,
          quizzes: res.data.quizzes || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  return (
    <AdminLayout>
      <h2 className="mb-4">📊 Admin Dashboard</h2>
      <Container fluid>
        <Row>
          <Col md={6} lg={4}>
            <StatCard title="Total Users" value={loading ? '...' : stats.totalUsers} icon={<FaUsers />} bg="#0d6efd" />
          </Col>
          <Col md={6} lg={4}>
            <StatCard title="Total Videos" value={loading ? '...' : stats.videos} icon={<FaVideo />} bg="#6610f2" />
          </Col>
          <Col md={6} lg={4}>
            <StatCard title="Total Assignments" value={loading ? '...' : stats.assignments} icon={<FaBook />} bg="#198754" />
          </Col>
          <Col md={6} lg={4}>
            <StatCard title="Total Quizzes" value={loading ? '...' : stats.quizzes} icon={<FaQuestionCircle />} bg="#fd7e14" />
          </Col>
        </Row>
      </Container>

      <h3 className="mt-5 mb-3">💰 Income Chart</h3>
      <IncomeChart />

    </AdminLayout>
  );
};

export default Dashboard;
