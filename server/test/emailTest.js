require('dotenv').config();
const emailService = require('../utils/emailConfig');

async function testEmail() {
  console.log('🧪 Testing Email Service...');
  console.log('Environment:', process.env.NODE_ENV);
  
  const testTicketData = {
    ticket_number: 'TKT-TEST-12345',
    subject: 'Test Ticket from Email System',
    description: 'This is a test email to verify the email notification system is working correctly.',
    status: 'OPEN',
    parent_id: 'TEST-PARENT-001'
  };

  try {
    const result = await emailService.sendTicketNotification(testTicketData);
    console.log('✅ Test email sent successfully!');
    console.log('Result:', result);
    
    if (result.previewUrl) {
      console.log('📧 Preview URL:', result.previewUrl);
      console.log('\nℹ️  Open this URL in browser to see the test email');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmail();
}

module.exports = testEmail;