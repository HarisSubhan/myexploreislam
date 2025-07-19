import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const plans = {
    monthly: {
      basic: { price: 9.99, features: ['10 projects', 'Basic analytics', 'Email support'] },
      pro: { price: 19.99, features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'API access'] },
      enterprise: { price: 49.99, features: ['Unlimited projects', 'Advanced analytics', '24/7 support', 'API access', 'Dedicated account manager'] }
    },
    yearly: {
      basic: { price: 99.99, features: ['10 projects', 'Basic analytics', 'Email support'] },
      pro: { price: 199.99, features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'API access'] },
      enterprise: { price: 499.99, features: ['Unlimited projects', 'Advanced analytics', '24/7 support', 'API access', 'Dedicated account manager'] }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for subscribing to our {selectedPlan} plan. We've sent a confirmation email to {email}.</p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Back to Plans
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Flexible pricing designed to fit your needs.
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm">
              <button
                type="button"
                className={`py-2 px-6 rounded-md text-sm font-medium ${selectedPlan === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`py-2 px-6 rounded-md text-sm font-medium ${selectedPlan === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:text-gray-900'}`}
                onClick={() => setSelectedPlan('yearly')}
              >
                Yearly (20% off)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(plans[selectedPlan]).map(([plan, details]) => (
            <motion.div 
              key={plan}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${plan === 'pro' ? 'ring-2 ring-indigo-600 transform scale-105' : ''}`}
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 capitalize">{plan}</h2>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">${details.price}</span>
                  <span className="ml-1 text-lg font-medium text-gray-500">/{selectedPlan === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {plan === 'pro' ? 'Most popular' : plan === 'enterprise' ? 'For large businesses' : 'Good for starters'}
                </p>
              </div>
              <div className="border-t border-gray-200 px-6 py-8 bg-gray-50">
                <ul className="space-y-3">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium ${plan === 'pro' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition duration-200`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto">
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Have questions?</h2>
            <p className="text-gray-600 mb-6">Contact our sales team for more information.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your question
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us about your needs..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Contact Sales'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;