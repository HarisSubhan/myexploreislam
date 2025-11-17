// components/ParentSupports.jsx
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

// (StatusBadge, SummaryCards, TicketRow, TicketsTable, AuthRequired same as before)
// I'll keep them unchanged for brevity — assume they are present here (unchanged).

// Small JWT decode util (same logic)
const decodeJwtPayload = (token) => {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadB64 = parts[1];
    const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const json = atob(b64 + pad);
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};

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

  const checkAuth = useCallback(() => {
    try {
      const rawUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      console.log("🔍 ParentSupports - Checking auth...", rawUser);

      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        const id =
          parsed.id ||
          parsed.userId ||
          parsed._id ||
          parsed.user_id ||
          parsed.email;
        const normalized = {
          ...parsed,
          id: id,
          name: parsed.name || parsed.username || parsed.email,
          email: parsed.email || "",
          role: parsed.role || "user",
        };
        setCurrentUser(normalized);
        return;
      }

      // fallback to token payload
      const payload = decodeJwtPayload(token);
      if (payload) {
        const id =
          payload.id ||
          payload.userId ||
          payload.sub ||
          payload._id ||
          payload.email;
        const normalized = {
          id,
          name: payload.name || payload.username || payload.email || "User",
          email: payload.email || "",
          role: payload.role || "user",
        };
        setCurrentUser(normalized);
        return;
      }

      setError("Please log in to access support tickets");
    } catch (err) {
      console.error("Error checking auth:", err);
      setError("Error checking authentication status");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // fetchTickets should only run when we have currentUser.id
  const fetchTickets = useCallback(async () => {
    if (!currentUser?.id) return;
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
  }, [currentUser]);

  const fetchSummary = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const response = await ticketApi.getSummary();
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  }, [currentUser]);

  // when currentUser becomes available, fetch
  useEffect(() => {
    if (currentUser?.id) {
      fetchTickets();
      fetchSummary();
    }
  }, [currentUser, fetchTickets, fetchSummary]);

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
        console.log("Creating ticket with user ID:", currentUser.id);
        await ticketApi.create(newTicket);
        setSuccess("Ticket created successfully!");
        await Promise.all([fetchTickets(), fetchSummary()]);
        handleCloseTicket();
      } catch (err) {
        setError(err.message);
        console.error("Ticket creation error:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [currentUser, newTicket, fetchTickets, fetchSummary, handleCloseTicket]
  );

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchTickets(), fetchSummary()]);
  }, [fetchTickets, fetchSummary]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setTickets([]);
    setSummary(null);
    setSuccess("Logged out successfully");
  }, []);

  const handleManualLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);

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
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center py-5">
            <FaExclamationCircle size={48} className="text-warning mb-3" />
            <h4>Authentication Required</h4>
            <p className="text-muted mb-4">
              Please log in to access the support center.
            </p>
            <Button variant="primary" onClick={handleManualLogin}>
              Go to Login Page
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {summary && (
            <Col xs={12}>
              {/* SummaryCards component (same as before) */}
              {/* Insert SummaryCards component here */}
            </Col>
          )}

          <Col xl={8} lg={7}>
            <Card className="shadow-sm border-0 rounded-3 h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaTicketAlt size={20} className="text-primary me-2" />
                  <h5 className="fw-bold m-0">Support Tickets</h5>
                </div>
                {/* TicketsTable component (same as before) */}
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
                    /* ... */
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
