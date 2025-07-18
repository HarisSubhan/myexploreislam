import React from 'react';
import { Container, Card, Form, Button, Row, Col, Badge, Alert, ListGroup } from 'react-bootstrap';
import { EnvelopeFill, TelephoneFill, GeoAltFill } from 'react-bootstrap-icons';

const ContactUs = () => {
  return (
    <Container className="my-5">
     <h1 className="text-center mb-4">
  <div 
    style={{ 
      backgroundColor: "#FB5607",
      width: "fit-content",
      maxWidth: "100%",
      minWidth: "300px",
      padding: "0.75rem 1.5rem",
      fontSize: "calc(1.325rem + 0.9vw)",
      color: "white",
      margin: "0 auto",
      borderRadius: "0.375rem"
    }}
  >
    Let's Get In Touch!
  </div>
</h1>
      
      <p className="text-center fs-4 mb-5 text-primary">
        We'd love to hear from you, little explorers!
      </p>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 border-primary">
            <Card.Header style={{backgroundColor: "#F1066C"}} className="text-white">
              <h3>Send Us a Message</h3>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Question</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    placeholder="What would you like to ask us?" 
                  />
                </Form.Group>

                <Button variant="success" size="lg" className="w-100">
                  Send Message
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 border-warning">
            <Card.Header className="bg-warning text-dark">
              <h3>Our Contact Info</h3>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="d-flex align-items-center">
                <EnvelopeFill className="me-3 fs-3" />
                <div>
                  <h5>Email Us</h5>
                  <p className="mb-0">kids@explorefun.com</p>
                </div>
              </Alert>

              <Alert variant="primary" className="d-flex align-items-center mt-3">
                <TelephoneFill className="me-3 fs-3" />
                <div>
                  <h5>Call Us</h5>
                  <p className="mb-0">1-800-KID-FUN</p>
                </div>
              </Alert>

              <Alert variant="success" className="d-flex align-items-center mt-3">
                <GeoAltFill className="me-3 fs-3" />
                <div>
                  <h5>Visit Us</h5>
                  <p className="mb-0">123 Discovery Lane, Adventure City</p>
                </div>
              </Alert>

              <div className="mt-4">
                <h5>Office Hours</h5>
                <ListGroup>
                  <ListGroup.Item>Monday-Friday: 9am - 5pm</ListGroup.Item>
                  <ListGroup.Item>Saturday: 10am - 4pm</ListGroup.Item>
                  <ListGroup.Item>Sunday: Closed</ListGroup.Item>
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
    </Container>
  );
};

export default ContactUs;