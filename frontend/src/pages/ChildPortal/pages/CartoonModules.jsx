import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaBookOpen, FaGamepad, FaMusic } from 'react-icons/fa';
import cartoonImage from '@images/c.png';

const CartoonModules = () => {
  const navigate = useNavigate();

  const modules = [
    { 
      title: "Watch Cartoons", 
      icon: <FaPlay size={28} className="text-white" />, 
      path: "/child/cartoons/watch",
      bgColor: "#FF6B6B"
    },
    { 
      title: "Story Books", 
      icon: <FaBookOpen size={28} className="text-white" />, 
      path: "/child/cartoons/stories",
      bgColor: "#4ECDC4"
    },
    { 
      title: "Interactive Games", 
      icon: <FaGamepad size={28} className="text-white" />, 
      path: "/child/cartoons/games",
      bgColor: "#3A86FF"
    },
    { 
      title: "Islamic Songs", 
      icon: <FaMusic size={28} className="text-white" />, 
      path: "/child/cartoons/songs",
      bgColor: "#FFBE0B"
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container
      fluid
      className="py-5"
      style={{
        background: "linear-gradient(to bottom right, #e0f7fa, #fff3e0)",
        minHeight: "100vh",
      }}
    >
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#0d6efd" }}>
        Islamic Cartoon World
      </h2>

      <Row className="g-4 justify-content-center">
        {modules.map((module, index) => (
          <Col key={index} xs={12} sm={8} md={6} lg={4} xl={3}>
            <Card
              onClick={() => handleCardClick(module.path)}
              className="h-100 border-0 text-center overflow-hidden"
              style={{
                borderRadius: '20px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
            >
              {/* Icon floating above the image */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: module.bgColor,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  zIndex: 2
                }}
              >
                {module.icon}
              </div>
              
              {/* Main image container */}
              <div 
                style={{
                  height: '200px',
                  backgroundImage: `url(${cartoonImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                {/* Gradient overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                  }}
                />
              </div>
              
              <Card.Body className="pb-4" style={{ position: 'relative', zIndex: 1 }}>
                <h5 
                  className="mt-3 mb-0 fw-bold" 
                  style={{
                    color: '#333',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
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

export default CartoonModules;