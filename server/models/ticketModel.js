const db = require('../config/db');

// ✅ Create Ticket
exports.createTicket = (ticketData, callback) => {
  const { ticket_number, subject, description, status } = ticketData;
  const sql = `
    INSERT INTO tickets (ticket_number, subject, description, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(sql, [ticket_number, subject, description, status], callback);
};

// ✅ Get Last Ticket Number
exports.getLastTicketNumber = (callback) => {
  const sql = "SELECT ticket_number FROM tickets ORDER BY id DESC LIMIT 1";
  db.query(sql, callback);
};

// ✅ Get All Tickets
exports.getAllTickets = (callback) => {
  const sql = `
    SELECT 
      id, 
      ticket_number, 
      subject, 
      description, 
      status, 
      created_at, 
      updated_at
    FROM tickets
    ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

// ✅ Get Ticket Summary (Admin Dashboard)
exports.getTicketSummary = (callback) => {
  const sql = `
    SELECT 
      COUNT(*) AS total_tickets,
      SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) AS open_tickets,
      SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_tickets,
      SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved_tickets
    FROM tickets
  `;
  db.query(sql, callback);
};
