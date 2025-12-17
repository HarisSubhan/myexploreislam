require('dotenv').config();
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    const environment = process.env.NODE_ENV || 'development';
    
    if (environment === 'development' || environment === 'test') {
      // Development/Test: Use ethereal.email (no real email needed)
      this.setupTestTransporter();
    } else {
      // Production: Use real email service
      this.setupProductionTransporter();
    }
  }

  async setupTestTransporter() {
    try {
      // Create test account on ethereal.email (fake SMTP service)
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      this.transporter.use('compile', htmlToText());
      
      console.log('Test Email Setup Complete');
      console.log('Test Account:', testAccount.user);
      console.log('Test Password:', testAccount.pass);
      
    } catch (error) {
      console.error('Failed to create test account:', error);
      // Fallback to console logging
      this.transporter = this.createConsoleTransporter();
    }
  }

  setupProductionTransporter() {
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    const config = {
      service: emailService,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    // Additional SMTP config for better reliability
    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
      config.host = process.env.EMAIL_HOST;
      config.port = process.env.EMAIL_PORT;
      config.secure = process.env.EMAIL_SECURE === 'true';
      delete config.service;
    }

    this.transporter = nodemailer.createTransport(config);
    this.transporter.use('compile', htmlToText());
    
    // Verify connection configuration
    this.verifyConnection();
  }

  createConsoleTransporter() {
    // For when you just want to log emails to console
    return {
      sendMail: (mailOptions) => {
        console.log('\n=== EMAIL LOG (Not Sent) ===');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('HTML:', mailOptions.html);
        console.log('============================\n');
        return Promise.resolve({
          messageId: 'console-mock-id',
          previewUrl: null
        });
      }
    };
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified successfully');
    } catch (error) {
      console.error('Email server connection failed:', error);
    }
  }

  async sendTicketNotification(ticketData) {
    try {
      const mailOptions = {
        from: this.getFromAddress(),
        to: this.getRecipientEmail(),
        subject: `🎫 New Ticket Created: ${ticketData.ticket_number}`,
        html: this.generateTicketEmailHTML(ticketData),
        replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for test emails
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log('📧 Email Preview URL:', previewUrl);
        }
      }
      
      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
      
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  getFromAddress() {
    const fromName = process.env.EMAIL_FROM_NAME || 'Ticket System';
    const fromEmail = process.env.EMAIL_USER;
    return `"${fromName}" <${fromEmail}>`;
  }

  getRecipientEmail() {
    // In production, send to actual email. In test, send to test inbox.
    if (process.env.NODE_ENV === 'production') {
      return process.env.EMAIL_TO || 'myexploreislam@gmail.com';
    }
    // In development/test, you can still send to real email or use test
    return process.env.EMAIL_TO_TEST || 'myexploreislam@gmail.com';
  }

  generateTicketEmailHTML(ticketData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .ticket-info { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎫 New Ticket Created</h2>
          </div>
          <div class="content">
            <div class="ticket-info">
              <p><span class="label">Ticket Number:</span> ${ticketData.ticket_number}</p>
              <p><span class="label">Subject:</span> ${ticketData.subject}</p>
              <p><span class="label">Description:</span></p>
              <p>${ticketData.description}</p>
              <p><span class="label">Status:</span> <span style="color: #4CAF50; font-weight: bold;">${ticketData.status}</span></p>
              <p><span class="label">Parent ID:</span> ${ticketData.parent_id}</p>
              <p><span class="label">Created At:</span> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from the Ticket System.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();