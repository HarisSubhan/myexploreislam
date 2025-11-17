import React from 'react';
import { Link } from 'react-router-dom';

const StripeCancelPage = () => {
  return (
    <div className="text-center p-5">
      <h2>Payment Cancelled</h2>
      <p>Your payment was cancelled. You can try again.</p>
      <Link to="/subscription" className="btn btn-primary">
        Back to Subscription Plans
      </Link>
    </div>
  );
};

export default StripeCancelPage;