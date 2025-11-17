import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Card } from 'react-bootstrap';
import { verifyPaymentStatus } from '../../services/api';


const StripeSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        // Verify payment with backend
        const result = await verifyPaymentStatus(sessionId);
        
        if (result.success) {
          setPaymentStatus('success');
          
          // Store authentication data
          if (result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('userRole', 'parent');
            localStorage.setItem('subscription_id', result.subscription_id);
            
            // Clear temporary user data
            localStorage.removeItem('temp_user');
          }
          
          setTimeout(() => {
            navigate('/parent');
          }, 3000);
        } else {
          setPaymentStatus('failed');
          setError(result.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setPaymentStatus('failed');
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Verifying your payment...</p>
        </div>
      </Container>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="text-center p-4" style={{ maxWidth: '500px' }}>
          <Card.Body>
            <div className="text-danger mb-3" style={{ fontSize: '4rem' }}>❌</div>
            <h3>Payment Failed</h3>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <p className="text-muted mb-4">
              There was an issue processing your payment. Please try again.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/subscription')}
            >
              Back to Subscription Plans
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="text-center p-4" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <div className="text-success mb-3" style={{ fontSize: '4rem' }}>✅</div>
          <h3>Payment Successful! 🎉</h3>
          <p className="text-muted mb-4">
            Thank you for your payment. Your subscription is now active.
            Redirecting to your dashboard...
          </p>
          <Spinner animation="border" variant="primary" />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StripeSuccessPage;