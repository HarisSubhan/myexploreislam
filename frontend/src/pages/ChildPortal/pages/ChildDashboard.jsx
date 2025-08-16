import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTv, FaPalette, FaBook, FaMusic, FaGamepad, FaSignInAlt } from 'react-icons/fa';
import "../../../components/child/ChildProfilePage.css";
import { getModuleApi } from '../../../services/moduleApi';

const iconMap = {
  video: <FaTv size={28} className="text-white" />,
  art: <FaPalette size={28} className="text-white" />,
  story: <FaBook size={28} className="text-white" />,
  music: <FaMusic size={28} className="text-white" />,
  game: <FaGamepad size={28} className="text-white" />,
  default: <FaPalette size={28} className="text-white" />
};

const colorPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

const ChildDashboard = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getModuleApi();
        
        const formattedModules = data.map((module, index) => ({
          id: module.id,
          title: module.name,
          icon: iconMap.default,
          path: `/child/module/${module.id}`,
          bgColor: colorPalette[index % colorPalette.length],
          thumbnail: module.thumbnail_url 
            ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${module.thumbnail_url}`
            : null,
        }));

        setModules(formattedModules);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        if (err.message.includes('401')) {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);



  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  if (loading) {
    return (
      <Container 
        fluid 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (unauthorized || error?.includes('session has expired') || error?.includes('No authentication')) {
    return (
      <Container 
        fluid 
        className="d-flex flex-column justify-content-center align-items-center text-center" 
        style={{ minHeight: '100vh', background: "linear-gradient(to bottom right, #e0f7fa, #fff3e0)" }}
      >
        <div className="p-4 rounded" style={{ background: 'white', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 className="text-danger mb-4">
            <FaSignInAlt className="me-2" />
            Session Expired
          </h3>
          <p className="mb-4">{error || 'Your session has expired. Please login to continue.'}</p>
          <Button 
            variant="primary" 
            onClick={handleLoginRedirect}
            size="lg"
          >
            Go to Login
          </Button>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container 
        fluid 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh' }}
      >
        <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '500px' }}>
          {error}
        </div>
      </Container>
    );
  }

  if (modules.length === 0) {
    return (
      <Container 
        fluid 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: '100vh' }}
      >
        <div className="alert alert-info text-center mx-auto" style={{ maxWidth: '500px' }}>
          No learning modules available right now. Please check back later.
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center py-4"
      style={{
        background: "linear-gradient(to bottom right, #e0f7fa, #fff3e0)",
        minHeight: "100vh",
      }}
    >
      <h2 className="text-center fw-bold mb-4" style={{ color: "#0d6efd" }}>
        Welcome to Your Learning World!
      </h2>

      <Row className="g-4 justify-content-center align-items-center">
        {modules.map((module) => (
          <Col key={module.id} xs={12} sm={8} md={6} lg={4} xl={3}>
            <Card
              onClick={() => handleCardClick(module.path)}
              className="h-100 border-0 text-center overflow-hidden module-card"
              style={{
                borderRadius: '20px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <div 
                className="module-icon"
                style={{
                  backgroundColor: module.bgColor,
                }}
              >
                {module.icon}
              </div>
              
              <div 
                className="module-thumbnail"
                style={{
                  backgroundImage: module.thumbnail ? 
                    `url(${module.thumbnail})` : 
                    'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)',
                }}
              >
                {!module.thumbnail && (
                  <div className="thumbnail-placeholder">
                    <span>{module.title}</span>
                  </div>
                )}
                <div className="thumbnail-overlay" />
              </div>
              
              <Card.Body className="pb-4">
                <h5 className="mt-3 mb-0 fw-bold module-title">
                  {module.title}
                </h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ChildDashboard;