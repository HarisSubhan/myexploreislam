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
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaExclamationCircle,
  FaUser,
} from "react-icons/fa";
import ticketApi from "../../../services/ticketapi";

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

// Memoized Summary Cards Component
const SummaryCards = React.memo(({ summary }) => {
  const cards = useMemo(
    () => [
      {
        key: "total",
        value: summary?.total_tickets,
        label: "Total Tickets",
        icon: FaTicketAlt,
        className: "bg-primary text-white",
      },
      {
        key: "open",
        value: summary?.open_tickets,
        label: "Open",
        icon: FaTimesCircle,
        className: "bg-danger text-white",
      },
      {
        key: "progress",
        value: summary?.in_progress_tickets,
        label: "In Progress",
        icon: FaSync,
        className: "bg-warning text-dark",
      },
      {
        key: "resolved",
        value: summary?.resolved_tickets,
        label: "Resolved",
        icon: FaCheckCircle,
        className: "bg-success text-white",
      },
    ],
    [summary]
  );

  return (
    <Row className="g-3">
      {cards.map(({ key, value, label, icon: Icon, className }) => (
        <Col key={key} md={3} sm={6} xs={12}>
          <Card className={`border-0 shadow-sm ${className}`}>
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold mb-0">{value || 0}</h4>
                  <small>{label}</small>
                </div>
                <Icon size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
});

// Memoized Ticket Row Component
const TicketRow = React.memo(({ ticket }) => {
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
    <tr>
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
      <td>
        <small>{formatDate(ticket.updated_at)}</small>
      </td>
    </tr>
  );
});

// Memoized Tickets Table Component
const TicketsTable = React.memo(
  ({ tickets, loading, currentUser, onOpenTicket }) => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading tickets...</p>
        </div>
      );
    }

    return (
      <>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
          <small className="text-muted">
            Showing {tickets.length} ticket(s)
            {currentUser && ` • ${currentUser.name} (ID: ${currentUser.id})`}
          </small>
          <Button
            variant="primary"
            onClick={onOpenTicket}
            className="d-flex align-items-center flex-shrink-0"
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
                <th>Subject</th>
                <th>Status</th>
                <th className="d-none d-md-table-cell">Created</th>
                <th className="d-none d-lg-table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted text-center py-4">
                    No tickets found. Create your first ticket!
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <TicketRow key={ticket.id} ticket={ticket} />
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
const AuthRequired = React.memo(({ onManualLogin, onTestLogin }) => (
  <Card className="shadow-sm border-0 rounded-3">
    <Card.Body className="text-center py-5">
      <FaExclamationCircle size={48} className="text-warning mb-3" />
      <h4>Authentication Required</h4>
      <p className="text-muted mb-4">
        Please log in to access the support center.
      </p>
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
        <Button variant="primary" onClick={onManualLogin} size="sm">
          Go to Login Page
        </Button>
        <Button variant="outline-secondary" onClick={onTestLogin} size="sm">
          Test Mode (Development)
        </Button>
      </div>
    </Card.Body>
  </Card>
));

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

  // Memoized auth check function
  const checkAuth = useCallback(() => {
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userData && token) {
        const user = JSON.parse(userData);
        const userId = user.id || user.userId || user._id;

        if (userId) {
          setCurrentUser({ ...user, id: userId });
          fetchTickets();
          fetchSummary();
        } else {
          setError("User data incomplete - missing user identifier");
        }
      } else {
        setError("Please log in to access support tickets");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setError("Error checking authentication status");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Memoized API calls
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ticketApi.getAll();
      setTickets(response.tickets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await ticketApi.getSummary();
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  }, []);

  const simulateLoginForTesting = useCallback(() => {
    const testUser = {
      id: 2,
      name: "parent",
      username: "parent",
      email: "parent@gmail.com",
      role: "parent",
    };
    const testToken = "test-token-123";

    localStorage.setItem("user", JSON.stringify(testUser));
    localStorage.setItem("token", testToken);
    setCurrentUser(testUser);
    setSuccess("Test login successful! You can now create tickets.");
    fetchTickets();
    fetchSummary();
  }, [fetchTickets, fetchSummary]);

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

  // Fixed handleSubmitTicket function - proper dependency array placement
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
        await ticketApi.create(newTicket);
        setSuccess("Ticket created successfully!");
        await Promise.all([fetchTickets(), fetchSummary()]);
        handleCloseTicket();
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [currentUser, newTicket, fetchTickets, fetchSummary, handleCloseTicket]
  ); // Fixed: dependency array properly placed

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchTickets(), fetchSummary()]);
  }, [fetchTickets, fetchSummary]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setTickets([]);
    setSummary(null);
    setError("Logged out successfully");
  }, []);

  const handleManualLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);

  // Memoized header component
  const headerContent = useMemo(
    () => (
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold text-primary mb-0">Support Center</h2>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {currentUser && (
            <div className="d-flex align-items-center gap-2">
              <Badge
                bg="light"
                text="dark"
                className="p-2 d-flex align-items-center"
              >
                <FaUser className="me-1" />
                <span className="d-none d-sm-inline">{currentUser.name}</span>
                <span className="d-sm-none">ID: {currentUser.id}</span>
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
            size="sm"
          >
            <FaSync className={loading ? "me-1 spin" : "me-1"} />
            Refresh
          </Button>
        </div>
      </div>
    ),
    [currentUser, loading, handleLogout, refreshAll]
  );

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
        <AuthRequired
          onManualLogin={handleManualLogin}
          onTestLogin={simulateLoginForTesting}
        />
      ) : (
        <Row className="g-3">
          {/* Summary Cards */}
          {summary && (
            <Col xs={12}>
              <SummaryCards summary={summary} />
            </Col>
          )}

          {/* Main Content */}
          <Col xl={8} lg={7}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaTicketAlt size={20} className="text-primary me-2" />
                  <h5 className="fw-bold m-0">Support Tickets</h5>
                </div>
                <TicketsTable
                  tickets={tickets}
                  loading={loading}
                  currentUser={currentUser}
                  onOpenTicket={handleOpenTicket}
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
                  <h5 className="fw-bold m-0">FAQs & Help</h5>
                </div>

                <Accordion flush className="mb-3">
                  {[
                    {
                      key: "0",
                      header: "🔑 How do I reset my password?",
                      body: "Go to Account Settings → Reset Password and follow the steps.",
                    },
                    {
                      key: "1",
                      header: "💳 How can I manage my subscription?",
                      body: "Visit Subscriptions & Billing to change your plan or payment method.",
                    },
                    {
                      key: "2",
                      header: "🕒 How do I set screen-time limits?",
                      body: "Navigate to Parental Controls and configure screen-time settings for each child.",
                    },
                  ].map(({ key, header, body }) => (
                    <Accordion.Item key={key} eventKey={key}>
                      <Accordion.Header className="py-2">
                        {header}
                      </Accordion.Header>
                      <Accordion.Body className="py-2">{body}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>

                <div className="p-3 bg-light rounded mb-3">
                  <h6 className="fw-bold mb-2">Quick Actions</h6>
                  <div className="d-grid gap-1">
                    <Button
                      variant="primary"
                      onClick={handleOpenTicket}
                      size="sm"
                    >
                      <FaPlusCircle className="me-1" />
                      Open New Ticket
                    </Button>
                    <Button variant="outline-primary" size="sm">
                      <FaEnvelope className="me-1" />
                      Contact Support
                    </Button>
                  </div>
                </div>

                {currentUser && (
                  <div className="p-3 bg-info bg-opacity-10 rounded">
                    <h6 className="fw-bold mb-2">User Information</h6>
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
                placeholder="Please provide detailed information about your issue..."
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
    </Container>
  );
};

export default React.memo(ParentSupports);
