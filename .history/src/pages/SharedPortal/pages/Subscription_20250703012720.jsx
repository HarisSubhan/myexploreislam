import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from 'react-bootstrap';

const Subscription = () => {
  const [plan, setPlan] = useState('monthly');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    // Simulate successful submission
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg rounded-4">
            <h3 className="text-center mb-4">Choose Your Subscription</h3>

            {submitted && <Alert variant="success">Subscribed successfully!</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Select Plan</Form.Label>
                <br />
                <ToggleButtonGroup
                  type="radio"
                  name="plans"
                  value={plan}
                  onChange={(val) => setPlan(val)}
                >
                  <ToggleButton id="monthly" value="monthly" variant="outline-primary">
                    Monthly - $10
                  </ToggleButton>
                  <ToggleButton id="yearly" value="yearly" variant="outline-primary">
                    Yearly - $99
                  </ToggleButton>
                </ToggleButtonGroup>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Subscribe Now
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Subscription;
