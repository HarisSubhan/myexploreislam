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
  FaUser,
} from "react-icons/fa";
import ticketApi from "../../../services/ticketApi";

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
    <Badge className={`${config.bg} d-flex align-items-center justify-content-center gap-1`}>
      {config.icon} {config.text}
    </Badge>
  );
});

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
            <small className="text-muted d-block text-truncate" style={{ maxWidth: "300px" }}>
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

const TicketsTable = React.memo(({ tickets, loading, onOpenTicket }) => {
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <small className="text-muted">Showing {tickets.length} ticket(s)</small>
        <Button variant="primary" onClick={onOpenTicket} size="sm">
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
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-muted text-center py-4">
                  No tickets found. Create your first ticket!
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
});

const AuthRequired = React.memo(() => (
  <Card className="shadow-sm border-0 rounded-3">
    <Card.Body className="text-center py-5">
      <h4>Authentication Required</h4>
      <p className="text-muted mb-4">Please log in to access the support center.</p>
      <Button variant="primary" onClick={() => window.location.href = "/login"}>
        Go to Login Page
      </Button>
    </Card.Body>
  </Card>
));

const ParentSupports = () => {
  const [showModal, setShowModal] = useState(false);
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
          };
          setCurrentUser(userWithId);
          fetchTickets();
        } else {
          setError("User data incomplete - please log in again");
        }
      } else {
        setError("Please log in to access support tickets");
      }
    } catch (error) {
      setError("Error checking authentication status");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchTickets = useCallback(async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError("");
    try {
      const response = await ticketApi.getById(currentUser.id);
      setTickets(response.tickets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

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

  const handleSubmitTicket = useCallback(async (e) => {
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
  }, [currentUser, newTicket, fetchTickets, handleCloseTicket]);

  const headerContent = useMemo(
    () => (
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary mb-0">Support Center</h2>
        {currentUser && (
          <Badge bg="light" text="dark" className="p-2 d-flex align-items-center">
            <FaUser className="me-1" />
            {currentUser.name}
          </Badge>
        )}
      </div>
    ),
    [currentUser]
  );

  return (
    <Container fluid className="p-3 p-md-4" style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {headerContent}

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible className="mb-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible className="mb-3">
          {success}
        </Alert>
      )}

      {!currentUser ? (
        <AuthRequired />
      ) : (
        <Row className="g-3">
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
                  onOpenTicket={handleOpenTicket}
                />
              </Card.Body>
            </Card>
          </Col>

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
                      header: "How do I reset my password?",
                      body: "Go to Account Settings → Reset Password and follow the steps.",
                    },
                    {
                      key: "1",
                      header: "How can I manage my subscription?",
                      body: "Visit Subscriptions & Billing to change your plan or payment method.",
                    },
                    {
                      key: "2",
                      header: "How do I set screen-time limits?",
                      body: "Navigate to Parental Controls and configure screen-time settings for each child.",
                    },
                  ].map(({ key, header, body }) => (
                    <Accordion.Item key={key} eventKey={key}>
                      <Accordion.Header className="py-2">{header}</Accordion.Header>
                      <Accordion.Body className="py-2">{body}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>

                <div className="p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Quick Actions</h6>
                  <div className="d-grid gap-1">
                    <Button variant="primary" onClick={handleOpenTicket} size="sm">
                      <FaPlusCircle className="me-1" />
                      Open New Ticket
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

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
                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                required
                maxLength={100}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Please provide detailed information about your issue..."
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
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