import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
} from 'react-bootstrap';

const plans = [
  {
    name: 'Basic',
    price: '$5/month',
    features: ['Access to free content', 'Standard support', 'Single device'],
    variant: 'light',
  },
  {
    name: 'Standard',
    price: '$10/month',
    features: ['All Basic features', 'Priority support', 'Access to quizzes'],
    variant: 'primary',
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    price: '$20/month',
    features: [
      'All Standard features',
      '1-on-1 mentoring',
      'Offline access',
      'Unlimited devices',
    ],
    variant: 'dark',
  },
];

const Subscription = () => {
  const [show, setShow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEmail('');
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Choose Your Plan</h2>
      <p className="text-center text-muted mb-5">
        Simple pricing. No hidden fees. Cancel anytime.
      </p>

      <Row className="g-4">
        {plans.map((plan, idx) => (
          <Col md={4} key={idx}>
            <Card
              className={`text-center shadow-lg border-0 h-100 bg-${plan.variant} text-${
                plan.variant === 'light' ? 'dark' : 'white'
              }`}
            >
              <Card.Body className="d-flex flex-column">
                {plan.badge && (
                  <Badge bg="warning" text="dark" className="mb-2">
                    {plan.badge}
                  </Badge>
                )}
                <Card.Title className="fs-3 fw-bold">{plan.name}</Card.Title>
                <Card.Subtitle className="mb-3 fs-4">{plan.price}</Card.Subtitle>
                <ul className="list-unstyled flex-grow-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="mb-2">
                      ✅ {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.variant === 'light' ? 'primary' : 'light'}
                  onClick={() => handleSubscribe(plan.name)}
                >
                  Subscribe
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Email Form */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subscribe to {selectedPlan} Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitted ? (
            <Alert variant="success">Subscription successful!</Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Enter your email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Confirm Subscription
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Subscription;
