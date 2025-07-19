import React from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import sideimage from '@images/side.png'; // ✅ Ensure this path is valid
import { useNavigate } from 'react-router-dom';

const SubscriptionModel = () => {
  const navigate = useNavigate();

  const handleClickButton = () => {
    navigate("/subscription"); 
  };
  const features = [
    {
      id: 1,
      title: "Anytime, Anywhere Access:",
      description: "Kids can watch videos on any device, at their convenience."
    },
    {
      id: 2,
      title: "Offline Learning:",
      description: "Videos can be downloaded within the app for offline access, worksheets can be done offline."
    },
    {
      id: 3,
      title: "Interactive Content:",
      description: "The platform includes engaging activities such as quizzes, worksheets, \"Match the Picture\" challenges, \"Match the Name to the Revealed Book,\" \"Fill in the Blanks\" & more to make learning fun and interactive."
    }
  ];

  return (
    <div style={{backgroundColor: "#e7fcff"}} className="bg-sky-50 d-flex align-items-center justify-content-center font-sans py-4 px-3">
      <Container style={{backgroundColor: "#e7fcff"}} fluid className="bg-white shadow-xl rounded-xl overflow-hidden ">
        <Row style={{backgroundColor: "#e7fcff"}} className="align-items-stretch flex-wrap">
          
         
          <Col xs={12} md={7} className="p-4 p-md-5 bg-gradient-to-br from-sky-100 to-blue-50">
            <ListGroup variant="flush">
              {features.map((feature) => (
                <ListGroup.Item key={feature.id} className="bg-transparent border-0 px-0 py-3">
                  <h5 className="fw-semibold text-primary text-lg mb-2">{feature.title}</h5>
                  <p className="text-muted small lh-base">{feature.description}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

         
          <Col
            xs={12}
            md={5}
            className="p-4 d-flex flex-column align-items-center justify-content-center text-center text-md-start"
            style={{
              backgroundImage: `url(${sideimage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              minHeight: '350px',
              
            }}
          >
            <div className="bg-opacity-75 p-3 w-100 text-primary d-flex flex-column align-items-center justify-content-center">
              <h1 className="fw-bold fs-2 mb-3">Subscription Model</h1>
              <p className="fs-1 fw-bold mb-3 text-dark">
                $39 <span className="fs-5 fw-semibold text-muted">/month</span>
              </p>
              <Button
              onClick={handleClickButton}
                variant="light"
                size="lg"
                className="fw-semibold py-2 px-5 rounded shadow-sm  w-md-auto"
              >
                Subscribe Now
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SubscriptionModel;
