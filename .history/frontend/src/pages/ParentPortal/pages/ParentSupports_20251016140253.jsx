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
  FaSync,
  FaExclamationCircle,
  FaChartBar,
  FaUser,
} from "react-icons/fa";


const ParentSupports = () => {
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
  });

  // Get current user from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (userData.id && token) {
      setCurrentUser(userData);
      fetchTickets();
      fetchSummary();
    } else {
      setError("Please log in to access support tickets");
    }
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ticketApi.getAll();
      setTickets(response.tickets || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await ticketApi.getSummary();
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const handleOpenTicket = () => {
    if (!currentUser?.id) {
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

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    if (!currentUser?.id) {
      setError("Please log in to create a ticket");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await ticketApi.create(newTicket);
      setSuccess(response.message || "Ticket created successfully!");
      // Refresh both tickets and summary after creating new ticket
      await fetchTickets();
      await fetchSummary();
      handleCloseTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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

  const refreshAll = async () => {
    await fetchTickets();
    await fetchSummary();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setTickets([]);
    setSummary(null);
    setError("Logged out successfully");
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Support Center</h2>
        <div className="d-flex align-items-center gap-3">
          {currentUser && (
            <div className="d-flex align-items-center gap-2">
              <Badge
                bg="light"
                text="dark"
                className="p-2 d-flex align-items-center"
              >
                <FaUser className="me-2" />
                {currentUser.name || currentUser.email} (ID: {currentUser.id})
              </Badge>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
          <Button
            variant="outline-primary"
            onClick={refreshAll}
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

      {!currentUser ? (
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
          {/* Summary Cards */}
          {summary && (
            <Col xs={12}>
              <Row className="g-3">
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm bg-primary text-white">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="fw-bold">{summary.total_tickets}</h4>
                          <small>Total Tickets</small>
                        </div>
                        <FaTicketAlt size={24} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm bg-danger text-white">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="fw-bold">{summary.open_tickets}</h4>
                          <small>Open</small>
                        </div>
                        <FaTimesCircle size={24} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm bg-warning text-dark">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="fw-bold">
                            {summary.in_progress_tickets}
                          </h4>
                          <small>In Progress</small>
                        </div>
                        <FaSync size={24} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm bg-success text-white">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="fw-bold">
                            {summary.resolved_tickets}
                          </h4>
                          <small>Resolved</small>
                        </div>
                        <FaCheckCircle size={24} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          )}

          {/* Tickets Section */}
          <Col lg={8}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaTicketAlt size={22} className="text-primary me-2" />
                  <h5 className="fw-bold m-0">All Support Tickets</h5>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    Showing {tickets.length} ticket(s)
                    {currentUser &&
                      ` • Logged in as: ${currentUser.name} (ID: ${currentUser.id})`}
                  </small>
                  <Button
                    variant="primary"
                    onClick={handleOpenTicket}
                    className="d-flex align-items-center"
                  >
                    <FaPlusCircle className="me-2" />
                    Open New Ticket
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
                          <th>Created Date</th>
                          <th>Updated Date</th>
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
                                <Badge bg="light" text="dark">
                                  {ticket.ticket_number}
                                </Badge>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-semibold">
                                    {ticket.subject}
                                  </div>
                                  {ticket.description && (
                                    <small
                                      className="text-muted d-block"
                                      style={{ maxWidth: "300px" }}
                                    >
                                      {ticket.description.length > 100
                                        ? `${ticket.description.substring(0, 100)}...`
                                        : ticket.description}
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>{getStatusBadge(ticket.status)}</td>
                              <td>
                                <small>{formatDate(ticket.created_at)}</small>
                              </td>
                              <td>
                                <small>{formatDate(ticket.updated_at)}</small>
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

          {/* FAQs & Quick Actions Section */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaQuestionCircle size={22} className="text-primary me-2" />
                  <h5 className="fw-bold m-0">FAQs & Help</h5>
                </div>

                <Accordion defaultActiveKey="0" className="mb-4">
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
                <div className="p-3 bg-light rounded">
                  <h6 className="fw-bold mb-3">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={handleOpenTicket}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaPlusCircle className="me-2" />
                      Open New Ticket
                    </Button>
                    <Button variant="outline-primary" size="sm">
                      <FaEnvelope className="me-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>

                {/* User Info */}
                {currentUser && (
                  <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                    <h6 className="fw-bold">User Information</h6>
                    <small className="text-muted">
                      <div>
                        <strong>Name:</strong> {currentUser.name}
                      </div>
                      <div>
                        <strong>Email:</strong> {currentUser.email}
                      </div>
                      <div>
                        <strong>User ID:</strong> {currentUser.id}
                      </div>
                      <div>
                        <strong>Role:</strong> {currentUser.role}
                      </div>
                    </small>
                  </div>
                )}
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
          {currentUser && (
            <div className="mb-3 p-3 bg-light rounded">
              <small>
                <strong>Creating ticket as:</strong> {currentUser.name} (ID:{" "}
                {currentUser.id})
              </small>
            </div>
          )}
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
    </Container>
  );
};

export default ParentSupports;
