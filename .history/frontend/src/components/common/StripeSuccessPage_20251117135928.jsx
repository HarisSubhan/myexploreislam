import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';


const StripeSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('Invalid payment session');
        setLoading(false);
        return;
      }

      try {
        const paymentStatus = await verifyStripePayment(sessionId);
        
        if (paymentStatus.success) {
          // Remove pending payment flag
          localStorage.removeItem('pendingPayment');
          localStorage.setItem('payment_status', 'completed');
          
          setTimeout(() => {
            navigate('/parent');
          }, 3000);
        } else {
          setError('Payment verification failed. Please contact support.');
        }
      } catch (err) {
        setError('Error verifying payment. Please contact support.');
        console.error('Payment verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  return (
    <Container className="text-center p-5">
      {loading ? (
        <div>
          <Spinner animation="border" role="status" className="mb-3" />
          <h4>Verifying your payment...</h4>
          <p>Please wait while we confirm your payment details.</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <h4>Payment Verification Failed</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/subscription')}>
            Back to Subscription
          </Button>
        </Alert>
      ) : (
        <div>
          <h2 className="text-success">Payment Successful! 🎉</h2>
          <p>Your subscription has been activated. Redirecting to your dashboard...</p>
        </div>
      )}
    </Container>
  );
};

export default StripeSuccessPage;