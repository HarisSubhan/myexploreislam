import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockStripeService } from '../../../services/mockStripeService';

const MockStripeCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '4242424242424242',
    expiry: '12/25',
    cvc: '123',
    name: 'John Doe'
  });

  const subscriptionPlans = {
    'plan_basic': { name: 'Basic Plan', price: '$9.99' },
    'plan_standard': { name: 'Standard Plan', price: '$19.99' },
    'plan_premium': { name: 'Premium Plan', price: '$29.99' }
  };

  const currentPlan = subscriptionPlans['plan_standard'] || { name: 'Standard Plan', price: '$19.99' };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus(null);

    try {
      const result = await MockStripeService.processMockPayment({
        amount: 1999,
        currency: 'usd',
        cardDetails: cardDetails
      });

      if (result.success) {
        setPaymentStatus('success');
        // Success hone par parent dashboard par redirect karein
        setTimeout(() => {
          localStorage.setItem('payment_status', 'completed');
          localStorage.setItem('subscription_active', 'true');
          navigate('/parent');
        }, 3000);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/subscription');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <h2>🔒 Mock Stripe Checkout</h2>
            <p className="text-muted">This is a mock payment page for development</p>
          </div>

          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Payment Details</h5>
            </Card.Header>
            <Card.Body>
              {/* Order Summary */}
              <div className="border-bottom pb-3 mb-3">
                <h6>Order Summary</h6>
                <div className="d-flex justify-content-between">
                  <span>{currentPlan.name}</span>
                  <span>{currentPlan.price}</span>
                </div>
                <small className="text-muted">Billed monthly</small>
              </div>

              {/* Mock Card Details */}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    placeholder="4242 4242 4242 4242"
                  />
                  <Form.Text className="text-muted">
                    Use 4242424242424242 for success simulation
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        placeholder="MM/YY"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVC</Form.Label>
                      <Form.Control
                        type="text"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                        placeholder="123"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </Form.Group>
              </Form>

              {/* Payment Status */}
              {paymentStatus === 'success' && (
                <Alert variant="success" className="text-center">
                  <h5>✅ Payment Successful!</h5>
                  <p>Redirecting to your dashboard...</p>
                </Alert>
              )}

              {paymentStatus === 'failed' && (
                <Alert variant="danger" className="text-center">
                  <h5>❌ Payment Failed</h5>
                  <p>Insufficient funds. Please try again.</p>
                </Alert>
              )}

              {paymentStatus === 'error' && (
                <Alert variant="warning" className="text-center">
                  <h5>⚠️ Payment Error</h5>
                  <p>Something went wrong. Please try again.</p>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ${currentPlan.price}`
                  )}
                </Button>
                
                <Button
                  variant="outline-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>

              {/* Development Info */}
              <div className="mt-3 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Development Note:</strong> This is a mock payment page. 
                  Payments are simulated with 90% success rate. 
                  No real transaction occurs.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MockStripeCheckout;