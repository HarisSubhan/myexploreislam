import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="payment-success">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your subscription. Your payment was processed successfully.</p>
        <Link to="/dashboard" className="success-button">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;