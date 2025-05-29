// import React from 'react';
// import StatCard from '../../../components/admin/StatCard';
// import Sidebar from '../../../components/admin/Sidebar';
// import { Container, Row, Col } from 'react-bootstrap';
// import { FaUsers, FaVideo, FaBook, FaQuestionCircle } from 'react-icons/fa';
// import AdminLayout from "../AdminApp";

// const Dashboard = () => {
//   return (
//     <AdminLayout>
//     <div className="d-flex">
//       <Sidebar />
//       <div className="flex-grow-1 p-4">
//         <h2 className="mb-4">📊 Admin Dashboard</h2>
//         <Container fluid>
//           <Row>
//             <Col md={6} lg={4}>
//               <StatCard title="Total Users" value="124" icon={<FaUsers />} bg="#0d6efd" />
//             </Col>
//             <Col md={6} lg={4}>
//               <StatCard title="Total Videos" value="85" icon={<FaVideo />} bg="#6610f2" />
//             </Col>
//             <Col md={6} lg={4}>
//               <StatCard title="Total Assignments" value="42" icon={<FaBook />} bg="#198754" />
//             </Col>
//             <Col md={6} lg={4}>
//               <StatCard title="Total Quizzes" value="31" icon={<FaQuestionCircle />} bg="#fd7e14" />
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </div>
//     </AdminLayout>
//   );
// };

// export default Dashboard;



import React from 'react';
import StatCard from '../../../components/admin/StatCard';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaVideo, FaBook, FaQuestionCircle } from 'react-icons/fa';
import AdminLayout from "../AdminApp";

const Dashboard = () => {
  return (
    <AdminLayout>
      <h2 className="mb-4">📊 Admin Dashboard</h2>
      <Container fluid>
        <Row>
          <Col md={6} lg={4}>
            <StatCard title="Total Users" value="124" icon={<FaUsers />} bg="#0d6efd" />
          </Col>
          <Col md={6} lg={4}>
            <StatCard title="Total Videos" value="85" icon={<FaVideo />} bg="#6610f2" />
          </Col>
          <Col md={6} lg={4}>
            <StatCard title="Total Assignments" value="42" icon={<FaBook />} bg="#198754" />
          </Col>
          <Col md={6} lg={4}>
            <StatCard title="Total Quizzes" value="31" icon={<FaQuestionCircle />} bg="#fd7e14" />
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
};

export default Dashboard;
