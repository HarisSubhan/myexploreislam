import React from 'react';
import { Button, Col, Row, Container, Card, Badge } from 'react-bootstrap';
import { FiCheckCircle, FiShoppingCart } from 'react-icons/fi';

const Subscription = () => {
  const features = [
    "Access to all basic features",
    "Priority customer support",
    "Monthly performance reports",
    "24/7 system monitoring",
  ];

  return (
    <Container className="my-5">
      <Card className="border-0 shadow-sm overflow-hidden">
        <Row className="g-0">
          {/* Left Column - Features */}
          <Col md={8} className="p-4 p-lg-5">
            <div className="d-flex align-items-center mb-3">
              <Badge bg="primary" className="me-2">POPULAR</Badge>
              <h2 className="mb-0">Premium Subscription</h2>
            </div>
            
            <p className="text-muted mb-4">Everything you need to grow your business</p>
            
            <div className="mb-4">
              <h5 className="mb-3">What's included:</h5>
              <ul className="list-unstyled">
                {features.map((feature, index) => (
                  <li key={index} className="mb-2 d-flex align-items-start">
                    <FiCheckCircle className="text-success me-2 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Right Column - Pricing */}
          <Col md={4} className="bg-light p-4 p-lg-5 d-flex flex-column">
            <div className="mb-auto">
              <div className="d-flex align-items-end mb-2">
                <h2 className="mb-0 display-5 fw-bold">$50</h2>
                <span className="text-muted ms-1">/month</span>
              </div>
              <p className="text-muted small">Billed annually or $60 month-to-month</p>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              className="mt-4 d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "#F1066C", borderColor: "#F1066C" }}
            >
              <FiShoppingCart size={18} />
              Add To Cart
            </Button>
            
            <div className="mt-3 text-center small text-muted">
              30-day money back guarantee
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Subscription;