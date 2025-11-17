import { MockStripeService } from './mockStripeService';

// Mock Register API
export const MockRegisterApi = async (userData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Basic validation
  if (!userData.email || !userData.password) {
    throw new Error("Email and password are required");
  }

  if (userData.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check if email already exists (mock)
  const existingUsers = ['test@example.com', 'user@gmail.com'];
  if (existingUsers.includes(userData.email)) {
    throw new Error("Email already registered");
  }

  // Create mock Stripe checkout session
  const stripeSession = await MockStripeService.createCheckoutSession({
    subscription_id: userData.subscription_id,
    customer_email: userData.email,
    amount: 1999, // $19.99 in cents
    currency: "usd"
  });

  return {
    success: true,
    message: "Registration successful. Redirect to payment.",
    user: {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      username: userData.username
    },
    ...stripeSession
  };
};