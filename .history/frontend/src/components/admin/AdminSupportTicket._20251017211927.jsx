import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Modal,
  Dropdown,
  Alert,
  Spinner,
} from "react-bootstrap";
import AdminLayout from "../../pages/AdminPortal/AdminApp";
import { useUser } from "../../context/UserContext";
import ticketApi from "../../services/ticketApi";

const AdminSupportTicket = () => {
  const { user } = useUser();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ticketApi.getAll();
      console.log("API Response:", response);

      // Transform API data to match your frontend structure
      const transformedTickets =
        response.tickets?.map((ticket) => {
          // Extract user information properly
          const userInfo = ticket.parent_id || ticket.user || {};

          // Determine user name - check multiple possible fields
          const getUserName = () => {
            if (userInfo.name) return userInfo.name;
            if (userInfo.username) return userInfo.username;
            if (userInfo.firstName && userInfo.lastName)
              return `${userInfo.firstName} ${userInfo.lastName}`;
            if (userInfo.email) return userInfo.email.split("@")[0];
            return "Unknown User";
          };

          return {
            id: ticket.id || ticket._id,
            ticketNumber:
              ticket.ticket_number || `TKT-${ticket.id?.toString().slice(-6)}`,
            subject: ticket.subject || "No Subject",
            description: ticket.description || "No description provided",
            user: {
              name: getUserName(),
              email: userInfo.email || "No email",
              type: "parent",
            },
            status: ticket.status?.toLowerCase() || "open",
            category: ticket.category || "general",
            createdAt: ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleString()
              : new Date().toLocaleString(),
            updatedAt: ticket.updatedAt
              ? new Date(ticket.updatedAt).toLocaleString()
              : new Date().toLocaleString(),
            lastReply: calculateLastReply(ticket.updatedAt || ticket.createdAt),
            messages: ticket.messages?.map((msg) => ({
              id: msg._id || msg.id,
              sender: msg.sender === "agent" ? "Support Agent" : getUserName(),
              message: msg.message || msg.content,
              timestamp: msg.timestamp
                ? new Date(msg.timestamp).toLocaleString()
                : new Date().toLocaleString(),
              type: msg.sender === "agent" ? "agent" : "user",
            })) || [
              {
                id: 1,
                sender: getUserName(),
                message: ticket.description || "No message",
                timestamp: ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleString()
                  : new Date().toLocaleString(),
                type: "user",
              },
            ],
          };
        }) || [];

      setTickets(transformedTickets);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate last reply time
  const calculateLastReply = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      const now = new Date();
      const updated = new Date(dateString);
      const diffMs = now - updated;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    } catch (e) {
      return "Unknown";
    }
  };

  // Load tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter tickets based on search and filters
  useEffect(() => {
    let result = tickets;

    if (searchTerm) {
      result = result.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.ticketNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    setFilteredTickets(result);
  }, [searchTerm, statusFilter, tickets]);

  const getStatusVariant = (status) => {
    const variants = {
      open: "primary",
      "in-progress": "info",
      resolved: "success",
    };
    return variants[status] || "secondary";
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setActionLoading(true);

      // Use the actual API call with the admin user info
      const newMessage = {
        sender: "agent",
        message: replyMessage,
        timestamp: new Date().toISOString(),
      };

      // API call to update ticket with new message
      await ticketApi.update(selectedTicket.id, {
        messages: [...selectedTicket.messages, newMessage],
        status: "in-progress",
      });

      // Update local state
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              messages: [
                ...ticket.messages,
                {
                  ...newMessage,
                  id: selectedTicket.messages.length + 1,
                  sender: "Support Agent",
                  type: "agent",
                },
              ],
              status: "in-progress",
              updatedAt: new Date().toLocaleString(),
              lastReply: "Just now",
            }
          : ticket
      );

      setTickets(updatedTickets);
      setReplyMessage("");

      // Update selected ticket in modal
      setSelectedTicket({
        ...selectedTicket,
        messages: [
          ...selectedTicket.messages,
          {
            ...newMessage,
            id: selectedTicket.messages.length + 1,
            sender: "Support Agent",
            type: "agent",
          },
        ],
        status: "in-progress",
        updatedAt: new Date().toLocaleString(),
        lastReply: "Just now",
      });
    } catch (err) {
      setError("Failed to send reply: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Fixed status change handlers using the specific API methods
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setActionLoading(true);

      // Use the specific API methods
      if (newStatus === "resolved") {
        await ticketApi.markAsResolved(ticketId);
      } else if (newStatus === "in-progress") {
        await ticketApi.markAsInProgress(ticketId);
      } else {
        // Fallback to generic update
        await ticketApi.update(ticketId, { status: newStatus });
      }

      // Update local state
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: newStatus,
              updatedAt: new Date().toLocaleString(),
            }
          : ticket
      );

      setTickets(updatedTickets);

      // Update selected ticket if it's the one being modified
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({
          ...selectedTicket,
          status: newStatus,
          updatedAt: new Date().toLocaleString(),
        });
      }
    } catch (err) {
      console.error("Error updating ticket status:", err);
      setError("Failed to update ticket status: " + err.message);
      // Refresh tickets to get current state
      fetchTickets();
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV function
  const exportToCSV = () => {
    if (tickets.length === 0) return;

    const headers = [
      "Ticket Number",
      "Subject",
      "User Name",
      "User Email",
      "Status",
      "Category",
      "Created At",
      "Last Updated",
    ];

    const csvData = tickets.map((ticket) => [
      ticket.ticketNumber,
      `"${ticket.subject.replace(/"/g, '""')}"`,
      `"${ticket.user.name.replace(/"/g, '""')}"`,
      `"${ticket.user.email}"`,
      ticket.status,
      ticket.category,
      ticket.createdAt,
      ticket.updatedAt,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `support-tickets-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading tickets...</span>
          </Spinner>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-support-ticket">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <h2>🎫 Support Tickets & Inquiries</h2>
            <p className="text-muted">
              Manage customer support requests and inquiries
            </p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={fetchTickets} disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Refresh"}
            </Button>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-primary">{ticketStats.total}</h4>
                <Card.Text>Total Tickets</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-warning">{ticketStats.open}</h4>
                <Card.Text>Open</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-info">{ticketStats.inProgress}</h4>
                <Card.Text>In Progress</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h4 className="text-success">{ticketStats.resolved}</h4>
                <Card.Text>Resolved</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Search Tickets</Form.Label>
                  <InputGroup>
                    <Form.Control
                      placeholder="Search by subject, ticket number, or user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tickets Table */}
        <Card>
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <Card.Title>Tickets ({filteredTickets.length})</Card.Title>
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={exportToCSV}
                >
                  Export CSV
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredTickets.length > 0 ? (
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Ticket #</th>
                    <th>Subject</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Last Update</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <strong>{ticket.ticketNumber}</strong>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{ticket.subject}</div>
                          <small
                            className="text-muted text-truncate d-block"
                            style={{ maxWidth: "200px" }}
                          >
                            {ticket.description}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{ticket.user.name}</div>
                          <small className="text-muted">
                            {ticket.user.email}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusVariant(ticket.status)}>
                          {ticket.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <div>{ticket.updatedAt.split(",")[0]}</div>
                          <small className="text-muted">
                            {ticket.lastReply}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            View
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              id="dropdown-basic"
                              disabled={actionLoading}
                            >
                              {actionLoading ? <Spinner size="sm" /> : "⋮"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  handleStatusChange(ticket.id, "in-progress")
                                }
                                disabled={ticket.status === "in-progress"}
                              >
                                Mark In Progress
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleStatusChange(ticket.id, "resolved")
                                }
                                disabled={ticket.status === "resolved"}
                              >
                                Mark Resolved
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <div className="fs-1">📭</div>
                <p className="text-muted">
                  {tickets.length === 0
                    ? "No tickets found"
                    : "No tickets found matching your filters"}
                </p>
                {tickets.length === 0 ? (
                  <Button variant="primary" onClick={fetchTickets}>
                    Try Again
                  </Button>
                ) : (
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Ticket Detail Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedTicket?.ticketNumber} - {selectedTicket?.subject}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {selectedTicket && (
              <div>
                {/* Ticket Info */}
                <Row className="mb-4">
                  <Col md={6}>
                    <strong>User:</strong> {selectedTicket.user.name}
                    <br />
                    <small className="text-muted">
                      {selectedTicket.user.email}
                    </small>
                  </Col>
                  <Col md={6}>
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusVariant(selectedTicket.status)}>
                      {selectedTicket.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </Col>
                </Row>

                {/* Messages */}
                <div className="messages-container">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.type === "agent" ? "agent-message" : "user-message"}`}
                    >
                      <div className="message-header">
                        <strong>{message.sender}</strong>
                        <small className="text-muted">
                          {message.timestamp}
                        </small>
                      </div>
                      <div className="message-content">{message.message}</div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="reply-section mt-4">
                  <Form.Group>
                    <Form.Label>Reply to Ticket</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Type your response here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      disabled={actionLoading}
                    />
                  </Form.Group>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleReply}
              disabled={!replyMessage.trim() || actionLoading}
            >
              {actionLoading ? "Sending..." : "Send Reply"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <style jsx>{`
        .admin-support-ticket {
          padding: 20px;
        }

        .messages-container {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
        }

        .user-message {
          background: #f8f9fa;
          border-left: 4px solid #007bff;
        }

        .agent-message {
          background: #e3f2fd;
          border-left: 4px solid #28a745;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .message-content {
          white-space: pre-wrap;
        }

        .reply-section {
          border-top: 1px solid #e9ecef;
          padding-top: 1rem;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminSupportTicket;
