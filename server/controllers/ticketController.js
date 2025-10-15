const Ticket = require("../models/ticketModel");

// ✅ Create Ticket Controller
exports.createTicket = (req, res) => {
  const { subject, description, parent_id } = req.body;

  if (!subject || !description || !parent_id) {
    return res.status(400).json({ message: "Subject, description, and parent_id are required." });
  }

  Ticket.getLastTicketNumber((err, result) => {
    if (err) {
      console.error("Error fetching last ticket:", err.message);
      return res.status(500).json({ message: "Database error." });
    }

    // 🔹 Generate New Ticket Number
    let newNumber = "001";
    if (result.length > 0) {
      const lastTicket = result[0].ticket_number;
      const lastNum = parseInt(lastTicket.split("-")[2]);
      newNumber = String(lastNum + 1).padStart(3, "0");
    }

    const ticketNumber = `TKT-2024-${newNumber}`;
    const status = "OPEN";

    const ticketData = {
      ticket_number: ticketNumber,
      subject,
      description,
      status,
    };

    // 🔹 Save to Database
    Ticket.createTicket(ticketData, (err, result) => {
      if (err) {
        console.error("Error inserting ticket:", err.message);
        return res.status(500).json({ message: "Failed to create ticket." });
      }

      res.status(201).json({
        message: "Ticket created successfully.",
        ticket: {
          id: result.insertId,
          ticket_number: ticketNumber,
          subject,
          description,
          status,
          created_at: new Date(),
        },
      });
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
