import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import parent from '@images/8.png';
import kids from '@images/c.png';
import track from '@images/10.png';
import background from '@images/background.png';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/subscription"); 
  };
  return (
    <section id="how-it-works">
<Container
      fluid
      className="py-5 "
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
        minHeight: '350px',
      }}
    >
      <h1 style={{color: "#F1066C"}} className="text-center display-lg-1 display-1 mb-5 fw-bold">How It Works</h1>
      <Row className="text-center font-sans">
        <Col xs={12} md={6} lg={4} className="mb-4">
          <img src={parent} alt="Parent Subscribe" className="img-fluid mb-3" />
          <p style={{color: "#F1066C"}} className="fw-bold">Step 1: Parent Subscribe</p>
          <h6>Create an account and add children</h6>
        </Col>
        <Col xs={12} md={6} lg={4} className="mb-4">
          <img src={kids} alt="Kid Start Learning" className="img-fluid mb-3" />
          <p style={{color: "#F1066C"}} className="fw-bold">Step 2: Kid Starts Learning</p>
          <h6>Watch animated videos, complete worksheets, and take quizzes</h6>
        </Col>
        <Col xs={12} md={12} lg={4} className="mb-4">
          <img src={track} alt="Track Progress" className="img-fluid mb-3" />
          <p style={{color: "#F1066C"}} className="fw-bold">Step 3: Parent Tracks Progress</p>
          <h6>Monitor progress through the parent dashboard</h6>
        </Col>
      </Row>
      <div className="d-flex flex-column flex-md-row justify-content-center gap-5 mt-4">
        <Button variant="primary">Learn More!</Button>
        <Button onClick={handleClick} style={{backgroundColor:"#ffc943"}} className='text-dark fw-bold'>Subscribe Now!</Button>
      </div>
    </Container>
    </section>
    
  );
};

export default HowItWorks;
