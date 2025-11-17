import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const StripeSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Backend se verify karein payment successful hai ya nahi
      localStorage.setItem('payment_status', 'completed');
      setTimeout(() => {
        navigate('/parent');
      }, 2000);
    }
  }, [navigate, searchParams]);

  return (
    <div className="text-center p-5">
      <h2>Payment Successful! 🎉</h2>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
};

export default StripeSuccessPage;