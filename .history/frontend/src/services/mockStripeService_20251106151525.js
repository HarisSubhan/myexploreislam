// Mock Stripe service for development
export const MockStripeService = {
  // Mock checkout session create karta hai
  createCheckoutSession: async (subscriptionData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful response
    return {
      success: true,
      stripeCheckoutUrl: "/mock-stripe-checkout",
      sessionId: `mock_session_${Math.random().toString(36).substr(2, 9)}`,
      message: "Redirect to mock Stripe payment page"
    };
  },

  // Mock payment process karta hai
  processMockPayment: async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 90% success rate ke saath mock payment
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return {
        success: true,
        paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
        status: "succeeded",
        message: "Payment completed successfully"
      };
    } else {
      return {
        success: false,
        error: "Payment failed - Insufficient funds",
        status: "failed"
      };
    }
  }
};