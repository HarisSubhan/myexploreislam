import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import Header from "../../../components/common/Header";
import MainFooter from './../../../components/MainFooter';

const plan = {
  id: "pro",
  name: "Pro",
  price: 19.99,
  displayPrice: "$19.99/month",
  description: "For serious learners and regular users.",
  features: [
    "All Basic features",
    "Unlimited device access",
    "Priority support",
    "Download content",
  ],
  variant: "outline-primary",
  badge: "Most Popular",
  max_children: 5,
  duration_months: 6
};

const Subscription = () => {
  const navigate = useNavigate();

  const handleSubscribeClick = () => {
    navigate('/register', {
      state: {
        planData: {
          plan_name: `${plan.name} Plan`,
          price: plan.price,
          max_children: plan.max_children,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setMonth(new Date().getMonth() + plan.duration_months))
                      .toISOString()
                      .split('T')[0]
        }
      }
    });
  };

  return (
    <div>
      <Header/>
      <div className="bg-dark text-white py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Upgrade Your Learning Journey</h1>
          <p className="lead mt-3">
            Choose our premium plan for the best learning experience. Cancel anytime.
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            className="mt-3"
            onClick={handleSubscribeClick}
          >
            Get Started
          </Button>
        </Container>
      </div>

      <Container className="my-5 text-center">
        <h2 className="mb-4">Our Premium Plan</h2>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="h-100 shadow-lg border-0">
              <Card.Body className="d-flex flex-column">
                <Badge bg="warning" text="dark" className="mb-2">
                  {plan.badge}
                </Badge>
                <Card.Title className="fs-3">{plan.name}</Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  {plan.description}
                </Card.Subtitle>
                <h3 className="my-3">{plan.displayPrice}</h3>
                <ul className="list-unstyled text-start flex-grow-1 px-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2">
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.variant}
                  onClick={handleSubscribeClick}
                >
                  Subscribe Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="my-5">
        <h2 className="text-center mb-4">FAQs</h2>
        <Row>
          <Col md={6}>
            <h5>Can I cancel anytime?</h5>
            <p>Yes, you can cancel your plan anytime.</p>
            <h5>Do you offer refunds?</h5>
            <p>We offer a 7-day money-back guarantee. No questions asked.</p>
          </Col>
          <Col md={6}>
            <h5>Is my data safe?</h5>
            <p>We use enterprise-grade encryption and never share your info.</p>
            <h5>How many devices can I use?</h5>
            <p>You can use unlimited devices with our Pro plan.</p>
          </Col>
        </Row>
      </Container>

      <div className="bg-primary text-white py-5 text-center">
        <Container>
          <h2 className="fw-bold">Ready to Level Up?</h2>
          <p className="lead">Join thousands of learners and start today.</p>
          <Button
            variant="light"
            size="lg"
            onClick={handleSubscribeClick}
          >
            Subscribe Now
          </Button>
        </Container>
      </div>
      <MainFooter/>
    </div>
  );
};

export default Subscription;