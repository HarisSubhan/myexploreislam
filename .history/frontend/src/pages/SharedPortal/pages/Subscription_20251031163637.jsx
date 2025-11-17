import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import Header from "../../../components/common/Header";
import MainFooter from "./../../../components/MainFooter";
import { getsubscriptionsAllActiveApi } from "../../../services/subscribeApi";

const Subscription = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getsubscriptionsAllActiveApi();
        setPlans(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch plans:", err);
      }
    };

    fetchPlans();
  }, []);

  // const handleSubscribeClick = (plan) => {
  //   navigate("/register", {
  //     state: {
  //       subscription_id: plan.id, 
  //       planData: plan, 
  //     },
  //   });
  // };

  const handleSubscribeClick = (plan) => {
  navigate("/payment", {
    state: {
      subscription_id: plan.id, 
      planData: plan, // pass selected plan details
    },
  });
};

  return (
    <div>
      <Header />
      <div className="bg-dark text-white py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Upgrade Your Learning Journey</h1>
          <p className="lead mt-3">
            Choose our premium plan for the best learning experience. Cancel
            anytime.
          </p>
          {plans.length > 0 && (
            <Button
              variant="primary"
              size="lg"
              className="mt-3"
              onClick={() => handleSubscribeClick(plans[0])}
            >
              Get Started
            </Button>
          )}
        </Container>
      </div>

      <Container className="my-5 text-center">
        <h2 className="mb-4">Our Premium Plans</h2>
        <Row className="justify-content-center">
          {plans.map((plan) => (
            <Col md={6} key={plan.id} className="mb-4">
              <Card className="h-100 shadow-lg border-0">
                <Card.Body className="d-flex flex-column">
                  <Badge bg="warning" text="dark" className="mb-2">
                    Popular
                  </Badge>
                  <Card.Title className="fs-3">{plan.plan_name}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {plan.max_children} children allowed
                  </Card.Subtitle>
                  <h3 className="my-3">${plan.price}</h3>
                  <ul className="list-unstyled text-start flex-grow-1 px-3">
                    <li className="mb-2">
                      ✅ Valid from{" "}
                      {new Date(plan.start_date).toLocaleDateString()}
                    </li>
                    <li className="mb-2">
                      ✅ Valid until{" "}
                      {new Date(plan.end_date).toLocaleDateString()}
                    </li>
                    <li className="mb-2">
                      ✅ Max {plan.max_children} children
                    </li>
                  </ul>
                  <Button
                    variant="primary"
                    onClick={() => handleSubscribeClick(plan)}
                  >
                    Subscribe Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
          {plans.length > 0 && (
            <Button
              variant="light"
              size="lg"
              onClick={() => handleSubscribeClick(plans[0])}
            >
              Subscribe Now
            </Button>
          )}
        </Container>
      </div>
      <MainFooter />
    </div>
  );
};

export default Subscription;
