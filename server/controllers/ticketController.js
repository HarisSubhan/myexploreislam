const Ticket = require("../models/ticketModel");

// ✅ Create Ticket Controller
exports.createTicket = (req, res) => {
  const { subject, description, parent_id } = req.body;

  if (!subject || !description || !parent_id) {
    return res.status(400).json({ message: "Subject, description, and parent_id are required" });
  }

  const ticketNumber = `TKT-${Date.now()}`;

  const ticketData = {
    ticket_number: ticketNumber,
    subject,
    description,
    status: 'OPEN',
    parent_id,
  };

  Ticket.createTicket(ticketData, (err, result) => {
    if (err) {
      console.error("Error creating ticket:", err);
      return res.status(500).json({ message: "Error creating ticket", error: err });
    }

    res.status(201).json({
      message: "Ticket created successfully",
      ticket_id: result.insertId,
      ticket_number: ticketNumber,
    });
  });
};


// ✅ Get All Tickets (Admin Side)
exports.getAllTickets = (req, res) => {
  const Ticket = require("../models/ticketModel");

  Ticket.getAllTickets((err, results) => {
    if (err) {
      console.error("Error fetching tickets:", err.message);
      return res.status(500).json({ message: "Database error." });
    }

    res.status(200).json({
      message: "All tickets fetched successfully.",
      total: results.length,
      tickets: results,
    });
  });
};


// ✅ Get Ticket Summary (Admin)
exports.getTicketSummary = (req, res) => {
  const Ticket = require("../models/ticketModel");

  Ticket.getTicketSummary((err, results) => {
    if (err) {
      console.error("Error fetching ticket summary:", err.message);
      return res.status(500).json({ message: "Database error." });
    }

    const summary = results[0]; // single row
    res.status(200).json({
      message: "Ticket summary fetched successfully.",
      data: summary,
    });
  });
};


// ✅ Mark Ticket as IN_PROGRESS
exports.markInProgress = (req, res) => {
  const ticketId = req.params.id;

  if (!ticketId) {
    return res.status(400).json({ message: "Ticket ID is required." });
  }

  Ticket.updateTicketStatus(ticketId, "IN_PROGRESS", (err, result) => {
    if (err) {
      console.error("Error updating ticket to IN_PROGRESS:", err.message);
      return res.status(500).json({ message: "Database error." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json({
      message: "Ticket marked as IN_PROGRESS successfully.",
    });
  });
};

// ✅ Mark Ticket as RESOLVED
exports.markResolved = (req, res) => {
  const ticketId = req.params.id;

  if (!ticketId) {
    return res.status(400).json({ message: "Ticket ID is required." });
  }

  Ticket.updateTicketStatus(ticketId, "RESOLVED", (err, result) => {
    if (err) {
      console.error("Error updating ticket to RESOLVED:", err.message);
      return res.status(500).json({ message: "Database error." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json({
      message: "Ticket marked as RESOLVED successfully.",
    });
  });
};


// ✅ Get Tickets By Parent (Parent Side)
exports.getTicketsByParent = (req, res) => {
  const parentId = req.params.parentId;

  if (!parentId) {
    return res.status(400).json({ message: "Parent ID is required." });
  }

  Ticket.getTicketsByParent(parentId, (err, results) => {
    if (err) {
      console.error("Error fetching tickets by parent:", err.message);
      return res.status(500).json({ message: "Database error." });
    }

    res.status(200).json({
      message: "Tickets fetched successfully.",
      total: results.length,
      tickets: results,
    });
  });
};
