import React, { useState } from "react";
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
} from "react-bootstrap";
import Header from "../../../components/common/Header";
import MainFooter from './../../../components/MainFooter';


const plans = [
  {
    name: "Basic",
    price: "$5/month",
    description: "Perfect for casual users starting out.",
    features: [
      "Access to basic content",
      "Single device access",
      "Email support",
    ],
    variant: "outline-secondary",
  },
  {
    name: "Pro",
    price: "$12/month",
    description: "For serious learners and regular users.",
    features: [
      "All Basic features",
      "Unlimited device access",
      "Priority support",
      "Download content",
    ],
    variant: "outline-primary",
    badge: "Most Popular",
  },
  {
    name: "Elite",
    price: "$25/month",
    description: "Full access for professionals and teams.",
    features: [
      "All Pro features",
      "Team collaboration",
      "1-on-1 coaching sessions",
      "Dedicated support manager",
    ],
    variant: "outline-dark",
  },
];

const Subscription = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribeClick = (planName) => {
    setSelectedPlan(planName);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setEmail("");
    }, 2000);
  };

  return (
    
    <div>
      <Header/>
      <div className="bg-dark text-white py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Upgrade Your Learning Journey</h1>
          <p className="lead mt-3">
            Choose a plan that fits your goals and budget. Cancel anytime.
          </p>
          <Button type="submit"  variant="primary" size="lg" className="mt-3">
            
            Get Started
          </Button>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="my-5 text-center">
        <h2 className="mb-4">Why Subscribe?</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h4>Unlimited Access</h4>
                <p>
                  Watch, learn, and grow with unlimited access to all content.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h4>Expert Support</h4>
                <p>Priority support from industry experts and educators.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h4>Cancel Anytime</h4>
                <p>No commitments. Upgrade, downgrade, or cancel anytime.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Pricing Section */}
      <Container className="my-5 text-center">
        <h2 className="mb-4">Our Plans</h2>
        <Row className="g-4">
          {plans.map((plan, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 shadow-lg border-0">
                <Card.Body className="d-flex flex-column">
                  {plan.badge && (
                    <Badge bg="warning" text="dark" className="mb-2">
                      {plan.badge}
                    </Badge>
                  )}
                  <Card.Title className="fs-3">{plan.name}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {plan.description}
                  </Card.Subtitle>
                  <h3 className="my-3">{plan.price}</h3>
                  <ul className="list-unstyled text-start flex-grow-1 px-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="mb-2">
                        ✅ {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.variant}
                    onClick={() => handleSubscribeClick(plan.name)}
                  >
                    Subscribe
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* FAQs Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">FAQs</h2>
        <Row>
          <Col md={6}>
            <h5>Can I cancel anytime?</h5>
            <p>Yes, you can cancel or change your plan anytime.</p>
            <h5>Do you offer refunds?</h5>
            <p>
              We offer a 7-day money-back guarantee on annual plans. No
              questions asked.
            </p>
          </Col>
          <Col md={6}>
            <h5>Is my data safe?</h5>
            <p>
              Absolutely. We use enterprise-grade encryption and never share
              your info.
            </p>
            <h5>Can I switch plans?</h5>
            <p>Yes, you can upgrade or downgrade your plan anytime.</p>
          </Col>
        </Row>
      </Container>

      {/* Call to Action */}
      <div className="bg-primary text-white py-5 text-center">
        <Container>
          <h2 className="fw-bold">Ready to Level Up?</h2>
          <p className="lead">Join thousands of learners and start today.</p>
          <Button
            variant="light"
            size="lg"
            onClick={() => handleSubscribeClick("Pro")}
          >
            Subscribe Now
          </Button>
        </Container>
      </div>

      
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subscribe to {selectedPlan} Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitted ? (
            <Alert variant="success">Subscription successful!</Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Confirm Subscription
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      <MainFooter/>
    </div>
  );
};

export default Subscription;
