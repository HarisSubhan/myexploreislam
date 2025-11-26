import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';

const StripeSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (sessionId) {
        try {
          // Backend se payment verify karein
          const response = await fetch(`/api/subscriptions/verify-payment?session_id=${sessionId}`);
          
          if (response.ok) {
            const result = await response.json();
            
            if (result.success) {
              setStatus('success');
              localStorage.setItem('payment_status', 'completed');
              localStorage.setItem('token', result.token);
              localStorage.setItem('userRole', 'parent');
              
              setTimeout(() => {
                navigate('/parent');
              }, 3000);
            } else {
              setStatus('failed');
            }
          } else {
            setStatus('failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setStatus('failed');
        }
      } else {
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  return (
    <Container className="text-center p-5">
      {status === 'processing' && (
        <>
          <Spinner animation="border" role="status" className="mb-3" />
          <h2>Verifying Your Payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <div className="text-success mb-3">
            <h1>✅</h1>
          </div>
          <h2>Payment Successful! 🎉</h2>
          <p>Your account has been activated successfully.</p>
          <Alert variant="success" className="mt-3">
            Redirecting to your dashboard...
          </Alert>
        </>
      )}
      
      {status === 'failed' && (
        <>
          <div className="text-danger mb-3">
            <h1>❌</h1>
          </div>
          <h2>Payment Verification Failed</h2>
          <p>There was an issue verifying your payment. Please contact support.</p>
          <Button variant="primary" onClick={() => navigate('/subscription')}>
            Back to Subscription
          </Button>
        </>
      )}
    </Container>
  );
};

export default StripeSuccessPage;