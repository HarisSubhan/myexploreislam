const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

// ✅ Parent creates a new ticket
router.post("/create", ticketController.createTicket);

router.get("/all", ticketController.getAllTickets);

router.get("/summary", ticketController.getTicketSummary);

module.exports = router;
