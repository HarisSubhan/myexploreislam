import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
  Accordion,
  Card,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  FaPlusCircle,
  FaTicketAlt,
  FaQuestionCircle,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaSync,
  FaExclamationCircle,
} from "react-icons/fa";
import { ticketApi } from "../services/ticketApi";

const ParentSupports = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
  });

  const [editingTicket, setEditingTicket] = useState({
    id: "",
    subject: "",
    description: "",
    status: "OPEN",
  });

  // Get current user on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(userData);

    if (userData.id || userData.parent_id) {
      fetchTickets();
    } else {
      setError("Please log in to access support tickets");
    }
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ticketApi.getAll();
      setTickets(response.tickets || response || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicket = () => {
    if (!currentUser?.id && !currentUser?.parent_id) {
      setError("Please log in to create a ticket");
      return;
    }
    setShowModal(true);
  };

  const handleCloseTicket = () => {
    setShowModal(false);
    setNewTicket({ subject: "", description: "" });
    setError("");
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket({
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
    });
    setShowEditModal(true);
  };

  const handleCloseEditTicket = () => {
    setShowEditModal(false);
    setEditingTicket({ id: "", subject: "", description: "", status: "OPEN" });
    setError("");
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    if (!currentUser?.id && !currentUser?.parent_id) {
      setError("Please log in to create a ticket");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await ticketApi.create(newTicket);
      setSuccess(response.message || "Ticket created successfully!");
      setTickets((prev) => [response.ticket, ...prev]);
      handleCloseTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await ticketApi.update(editingTicket.id, {
        subject: editingTicket.subject,
        description: editingTicket.description,
        status: editingTicket.status,
      });
      setSuccess(response.message || "Ticket updated successfully!");
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === editingTicket.id ? response.ticket : ticket
        )
      );
      handleCloseEditTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await ticketApi.delete(ticketId);
      setSuccess("Ticket deleted successfully");
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setError("");
    setSuccess("");

    try {
      const response = await ticketApi.updateStatus(ticketId, newStatus);
      setSuccess(response.message || "Status updated successfully!");
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? response.ticket : ticket
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      OPEN: { bg: "danger", icon: <FaTimesCircle />, text: "Open" },
      IN_PROGRESS: { bg: "warning text-dark", icon: "⏳", text: "In Progress" },
      RESOLVED: { bg: "success", icon: <FaCheckCircle />, text: "Resolved" },
      CLOSED: { bg: "secondary", icon: "🔒", text: "Closed" },
    };

    const config = statusConfig[status] || statusConfig.OPEN;

    return (
      <Badge
        className={`${config.bg} d-flex align-items-center justify-content-center gap-1`}
      >
        {config.icon} {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTicketNumber = (ticket) => {
    return ticket.ticket_number || `TKT-${ticket.id}`;
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Support Center</h2>
        <div className="d-flex gap-2">
          {currentUser && (
            <Badge bg="light" text="dark" className="p-2">
              Welcome, {currentUser.name || currentUser.email}
            </Badge>
          )}
          <Button
            variant="outline-primary"
            onClick={fetchTickets}
            disabled={loading}
          >
            <FaSync className={loading ? "me-2 spin" : "me-2"} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          <FaExclamationCircle className="me-2" />
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}

      {!currentUser?.id && !currentUser?.parent_id ? (
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center py-5">
            <FaExclamationCircle size={48} className="text-warning mb-3" />
            <h4>Authentication Required</h4>
            <p className="text-muted">
              Please log in to access the support center.
            </p>
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {/* Tickets Section */}
          <Col lg={6}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaTicketAlt size={22} className="text-primary me-2" />
                  <h5 className="fw-bold m-0">My Support Tickets</h5>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    {tickets.length} ticket(s) found
                  </small>
                  <Button
                    variant="primary"
                    onClick={handleOpenTicket}
                    className="d-flex align-items-center"
                  >
                    <FaPlusCircle className="me-2" />
                    Open Ticket
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading tickets...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover bordered className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Ticket #</th>
                          <th>Subject</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.length === 0 ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-muted text-center py-4"
                            >
                              No tickets found. Create your first ticket!
                            </td>
                          </tr>
                        ) : (
                          tickets.map((ticket) => (
                            <tr key={ticket.id}>
                              <td>
                                <small className="text-muted">
                                  {getTicketNumber(ticket)}
                                </small>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-semibold">
                                    {ticket.subject}
                                  </div>
                                  {ticket.description && (
                                    <small
                                      className="text-muted text-truncate d-block"
                                      style={{ maxWidth: "200px" }}
                                    >
                                      {ticket.description}
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-1">
                                  {getStatusBadge(ticket.status)}
                                  {ticket.status === "OPEN" && (
                                    <Button
                                      size="sm"
                                      variant="outline-success"
                                      onClick={() =>
                                        handleStatusUpdate(
                                          ticket.id,
                                          "IN_PROGRESS"
                                        )
                                      }
                                    >
                                      Mark In Progress
                                    </Button>
                                  )}
                                  {ticket.status === "IN_PROGRESS" && (
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      onClick={() =>
                                        handleStatusUpdate(
                                          ticket.id,
                                          "RESOLVED"
                                        )
                                      }
                                    >
                                      Mark Resolved
                                    </Button>
                                  )}
                                </div>
                              </td>
                              <td>
                                <small>{formatDate(ticket.created_at)}</small>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center gap-1">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleEditTicket(ticket)}
                                    title="Edit Ticket"
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteTicket(ticket.id)
                                    }
                                    title="Delete Ticket"
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* FAQs Section */}
          <Col lg={6}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaQuestionCircle size={22} className="text-primary me-2" />
                  <h5 className="fw-bold m-0">FAQs</h5>
                </div>

                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      🔑 How do I reset my password?
                    </Accordion.Header>
                    <Accordion.Body>
                      Go to <b>Account Settings</b> → Reset Password and follow
                      the steps.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      💳 How can I manage my subscription?
                    </Accordion.Header>
                    <Accordion.Body>
                      Visit <b>Subscriptions & Billing</b> to change your plan
                      or payment method.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      🕒 How do I set screen-time limits?
                    </Accordion.Header>
                    <Accordion.Body>
                      Navigate to <b>Parental Controls</b> and configure
                      screen-time settings for each child.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                {/* Quick Actions */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-3">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" size="sm">
                      <FaEnvelope className="me-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      View Knowledge Base
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Create Ticket Modal */}
      <Modal show={showModal} onHide={handleCloseTicket} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold d-flex align-items-center">
            <FaPlusCircle className="me-2 text-primary" />
            Open a New Support Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTicket}>
            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brief description of your issue"
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, subject: e.target.value })
                }
                required
                maxLength={100}
              />
              <Form.Text className="text-muted">
                {newTicket.subject.length}/100 characters
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Please provide detailed information about your issue..."
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                className="fw-bold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating Ticket...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </Button>
              <Button variant="outline-secondary" onClick={handleCloseTicket}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Ticket Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditTicket} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold d-flex align-items-center">
            <FaEdit className="me-2 text-primary" />
            Edit Support Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateTicket}>
            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={editingTicket.subject}
                onChange={(e) =>
                  setEditingTicket({
                    ...editingTicket,
                    subject: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your issue"
                value={editingTicket.description}
                onChange={(e) =>
                  setEditingTicket({
                    ...editingTicket,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editingTicket.status}
                onChange={(e) =>
                  setEditingTicket({ ...editingTicket, status: e.target.value })
                }
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </Form.Select>
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                className="fw-bold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  "Update Ticket"
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleCloseEditTicket}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ParentSupports;
