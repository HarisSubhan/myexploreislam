import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaUser,
  FaHistory,
} from "react-icons/fa";
import ticketApi from "../../../services/ticketApi";

// Memoized Status Badge Component
const StatusBadge = React.memo(({ status }) => {
  const statusConfig = useMemo(
    () => ({
      OPEN: { bg: "danger", icon: <FaTimesCircle />, text: "Open" },
      IN_PROGRESS: { bg: "warning text-dark", icon: "⏳", text: "In Progress" },
      RESOLVED: { bg: "success", icon: <FaCheckCircle />, text: "Resolved" },
      CLOSED: { bg: "secondary", icon: "🔒", text: "Closed" },
    }),
    []
  );

  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <Badge
      className={`${config.bg} d-flex align-items-center justify-content-center gap-1`}
    >
      {config.icon} {config.text}
    </Badge>
  );
});

// Memoized Ticket Row Component
const TicketRow = React.memo(({ ticket, onClick }) => {
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <tr onClick={() => onClick(ticket)} style={{ cursor: "pointer" }}>
      <td>
        <Badge bg="light" text="dark">
          {ticket.ticket_number}
        </Badge>
      </td>
      <td>
        <div>
          <div className="fw-semibold">{ticket.subject}</div>
          {ticket.description && (
            <small
              className="text-muted d-block text-truncate"
              style={{ maxWidth: "min(300px, 30vw)" }}
            >
              {ticket.description}
            </small>
          )}
        </div>
      </td>
      <td>
        <StatusBadge status={ticket.status} />
      </td>
      <td>
        <small>{formatDate(ticket.created_at)}</small>
      </td>
    </tr>
  );
});

// Memoized Tickets Table Component
const TicketsTable = React.memo(
  ({ tickets, loading, currentUser, onOpenTicket, onTicketClick }) => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading your tickets...</p>
        </div>
      );
    }

    return (
      <>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
          <div>
            <h6 className="fw-bold mb-1">Your Support Tickets</h6>
            <small className="text-muted">
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} in total
            </small>
          </div>
          <Button
            variant="primary"
            onClick={onOpenTicket}
            className="d-flex align-items-center"
            size="sm"
          >
            <FaPlusCircle className="me-1" />
            New Ticket
          </Button>
        </div>

        <div className="table-responsive">
          <Table hover bordered className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Ticket #</th>
                <th>Subject & Description</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-muted text-center py-4">
                    <div className="mb-2">
                      <FaTicketAlt size={32} className="text-muted" />
                    </div>
                    <p className="mb-2">No support tickets yet</p>
                    <small>Create your first ticket to get help</small>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <TicketRow 
                    key={ticket.id} 
                    ticket={ticket} 
                    onClick={onTicketClick}
                  />
                ))
              )}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
);

// Memoized Authentication Required Component
const AuthRequired = React.memo(({ onManualLogin }) => (
  <Card className="shadow-sm border-0 rounded-3">
    <Card.Body className="text-center py-5">
      <FaExclamationCircle size={48} className="text-warning mb-3" />
      <h4>Authentication Required</h4>
      <p className="text-muted mb-4">
        Please log in to access the support center.
      </p>
      <Button variant="primary" onClick={onManualLogin}>
        Go to Login Page
      </Button>
    </Card.Body>
  </Card>
));

// Ticket Details Modal Component
const TicketDetailsModal = React.memo(({ show, ticket, onHide }) => {
  if (!ticket) return null;

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <FaTicketAlt className="me-2 text-primary" />
          Ticket Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Badge bg="light" text="dark" className="fs-6">
                {ticket.ticket_number}
              </Badge>
              <h5 className="mt-2 mb-1">{ticket.subject}</h5>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="text-end">
              <small className="text-muted d-block">Created</small>
              <small className="fw-semibold">{formatDate(ticket.created_at)}</small>
            </div>
          </div>
          
          <div className="mb-3">
            <h6 className="fw-bold mb-2">Description</h6>
            <div className="p-3 bg-light rounded">
              {ticket.description || "No description provided."}
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <small className="text-muted d-block">Last Updated</small>
              <small className="fw-semibold">{formatDate(ticket.updated_at)}</small>
            </div>
            {ticket.priority && (
              <div className="col-6">
                <small className="text-muted d-block">Priority</small>
                <small className="fw-semibold text-capitalize">
                  {ticket.priority}
                </small>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

const ParentSupports = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
  });

  // Auto-refresh interval in milliseconds (5 minutes)
  const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

  const checkAuth = useCallback(() => {
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userData && token) {
        const user = JSON.parse(userData);
        const userId = user.id || user.userId || user._id || user.user_id || user.email;

        if (userId) {
          const userWithId = {
            ...user,
            id: userId,
            name: user.name || user.username || user.email,
            email: user.email || "",
            role: user.role || "user",
          };
          setCurrentUser(userWithId);
        } else {
          setError("User data incomplete - please log in again");
        }
      } else {
        setError("Please log in to access support tickets");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setError("Error checking authentication status");
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await ticketApi.getById(currentUser.id);
      setTickets(response.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchTickets();
    }
  }, [currentUser, fetchTickets]);

  // Auto-refresh tickets periodically
  useEffect(() => {
    if (!currentUser?.id) return;

    const interval = setInterval(() => {
      fetchTickets();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [currentUser, fetchTickets]);

  const handleOpenTicket = useCallback(() => {
    if (!currentUser?.id) {
      setError("Please log in to create a ticket");
      return;
    }
    setShowModal(true);
  }, [currentUser]);

  const handleCloseTicket = useCallback(() => {
    setShowModal(false);
    setNewTicket({ subject: "", description: "" });
    setError("");
  }, []);

  const handleSubmitTicket = useCallback(
    async (e) => {
      e.preventDefault();

      if (!currentUser?.id) {
        setError("Please log in to create a ticket");
        return;
      }

      setSubmitting(true);
      setError("");
      setSuccess("");

      try {
        const ticketData = {
          subject: newTicket.subject,
          description: newTicket.description,
          parent_id: currentUser.id
        };
        
        await ticketApi.create(ticketData);
        setSuccess("Ticket created successfully!");
        await fetchTickets();
        handleCloseTicket();
      } catch (err) {
        console.error("Ticket creation error:", err);
        setError(err.message);
        
        if (err.message.includes('authenticated') || err.message.includes('login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
          setError("Session expired. Please log in again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [currentUser, newTicket, fetchTickets, handleCloseTicket]
  );

  const handleTicketClick = useCallback((ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedTicket(null);
  }, []);

  const handleManualLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);

  // Memoized header component
  const headerContent = useMemo(
    () => (
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">Support Center</h2>
          <p className="text-muted mb-0">Get help and manage your support tickets</p>
        </div>
        {currentUser && (
          <div className="d-flex align-items-center gap-2">
            <Badge
              bg="light"
              text="dark"
              className="p-2 d-flex align-items-center"
            >
              <FaUser className="me-1" />
              <span>{currentUser.name}</span>
            </Badge>
          </div>
        )}
      </div>
    ),
    [currentUser]
  );

  // Stats summary
  const ticketStats = useMemo(() => {
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;

    return { openTickets, inProgressTickets, resolvedTickets };
  }, [tickets]);

  return (
    <Container
      fluid
      className="p-3 p-md-4"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      {headerContent}

      {/* Alerts */}
      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
          className="mb-3"
        >
          <FaExclamationCircle className="me-2" />
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          variant="success"
          onClose={() => setSuccess("")}
          dismissible
          className="mb-3"
        >
          {success}
        </Alert>
      )}

      {!currentUser ? (
        <AuthRequired onManualLogin={handleManualLogin} />
      ) : (
        <Row className="g-3">
          {/* Stats Overview */}
          <Col lg={12} className="mb-3">
            <Row className="g-2">
              <Col md={4}>
                <Card className="border-0 bg-primary text-white">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">Open Tickets</h6>
                        <h4 className="mb-0 fw-bold">{ticketStats.openTickets}</h4>
                      </div>
                      <FaHistory size={24} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 bg-warning text-dark">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">In Progress</h6>
                        <h4 className="mb-0 fw-bold">{ticketStats.inProgressTickets}</h4>
                      </div>
                      <FaHistory size={24} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 bg-success text-white">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">Resolved</h6>
                        <h4 className="mb-0 fw-bold">{ticketStats.resolvedTickets}</h4>
                      </div>
                      <FaCheckCircle size={24} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Tickets Table */}
          <Col xl={8} lg={7}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <TicketsTable
                  tickets={tickets}
                  loading={loading}
                  currentUser={currentUser}
                  onOpenTicket={handleOpenTicket}
                  onTicketClick={handleTicketClick}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xl={4} lg={5}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaQuestionCircle size={20} className="text-primary me-2" />
                  <h5 className="fw-bold m-0">Help & Resources</h5>
                </div>

                <Accordion flush className="mb-3">
                  {[
                    {
                      key: "0",
                      header: "🔑 Password Reset",
                      body: "Go to Account Settings → Reset Password and follow the steps.",
                    },
                    {
                      key: "1",
                      header: "💳 Subscription Management",
                      body: "Visit Subscriptions & Billing to change your plan or payment method.",
                    },
                    {
                      key: "2",
                      header: "🕒 Screen Time Limits",
                      body: "Navigate to the Dashboard to watch the screen time for each child.",
                    },
                  ].map(({ key, header, body }) => (
                    <Accordion.Item key={key} eventKey={key}>
                      <Accordion.Header className="py-2">
                        <small>{header}</small>
                      </Accordion.Header>
                      <Accordion.Body className="py-2">
                        <small>{body}</small>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>

                <div className="p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Need Help?</h6>
                  <p className="small text-muted mb-3">
                    Can't find what you're looking for? Our support team is here to help you with any issues or questions.
                  </p>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      onClick={handleOpenTicket}
                      size="sm"
                    >
                      <FaPlusCircle className="me-1" />
                      Create Support Ticket
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Create Ticket Modal */}
      <Modal show={showModal} onHide={handleCloseTicket} centered size="lg">
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="fw-bold d-flex align-items-center">
            <FaPlusCircle className="me-2 text-primary" />
            New Support Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {currentUser && (
            <div className="mb-3 p-2 bg-light rounded">
              <small>
                <strong>Creating ticket as:</strong> {currentUser.name}
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
                  setNewTicket((prev) => ({ ...prev, subject: e.target.value }))
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
                placeholder="Please provide detailed information about your issue. Include any error messages, steps to reproduce, and what you were trying to accomplish."
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating Ticket...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        show={showDetailsModal}
        ticket={selectedTicket}
        onHide={handleCloseDetailsModal}
      />
    </Container>
  );
};

export default React.memo(ParentSupports);