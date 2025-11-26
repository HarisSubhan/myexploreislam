const db = require('../config/db');

// ✅ Create Ticket
exports.createTicket = (ticketData, callback) => {
  const { ticket_number, subject, description, status, parent_id } = ticketData;
  const sql = `
    INSERT INTO tickets (ticket_number, subject, description, status, parent_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(sql, [ticket_number, subject, description, status, parent_id], callback);
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
      t.id, 
      t.ticket_number, 
      t.subject, 
      t.description, 
      t.status, 
      t.created_at, 
      t.updated_at,
      u.name AS name
    FROM tickets t
    LEFT JOIN users u ON t.parent_id = u.id
    ORDER BY t.created_at DESC
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


// ✅ Update Ticket Status
exports.updateTicketStatus = (ticketId, status, callback) => {
  const sql = `
    UPDATE tickets
    SET status = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [status, ticketId], callback);
};


// ✅ Get Tickets by Parent ID
exports.getTicketsByParent = (parentId, callback) => {
  const sql = `
    SELECT 
      t.id, 
      t.ticket_number, 
      t.subject, 
      t.description, 
      t.status, 
      t.created_at, 
      t.updated_at
    FROM tickets t
    WHERE t.parent_id = ?
    ORDER BY t.created_at DESC
  `;
  db.query(sql, [parentId], callback);
};

