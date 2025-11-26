const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

// ✅ Parent creates a new ticket
router.post("/create", ticketController.createTicket);

router.get("/all", ticketController.getAllTickets);

router.get("/summary", ticketController.getTicketSummary);

router.put("/:id/in-progress", ticketController.markInProgress);

router.put("/:id/resolved", ticketController.markResolved);

router.get("/parent/:parentId", ticketController.getTicketsByParent);

module.exports = router;
