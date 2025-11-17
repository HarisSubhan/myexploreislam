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
  Spinner,
  Alert,
} from "react-bootstrap";
import AdminLayout from "../../pages/AdminPortal/AdminApp";
import { ticketApi } from "../../services/ticketApi"; // Adjust the import path as needed

const AdminSupportTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch tickets from API
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ticketApi.getAll();

      // Transform API response to match component structure
      const formattedTickets = response.data?.map((ticket) => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number || `TKT-${ticket.id}`,
        subject: ticket.subject,
        description: ticket.description,
        user: {
          name: ticket.parent_name || "Unknown User",
          email: ticket.parent_email || "No email",
          type: "parent", // You might want to get this from your API
        },
        priority: ticket.priority?.toLowerCase() || "medium",
        status: ticket.status?.toLowerCase() || "open",
        category: ticket.category || "general",
        assignedTo: ticket.assigned_to || "Not assigned",
        createdAt: ticket.created_at
          ? new Date(ticket.created_at).toLocaleString()
          : new Date().toLocaleString(),
        updatedAt: ticket.updated_at
          ? new Date(ticket.updated_at).toLocaleString()
          : new Date().toLocaleString(),
        lastReply: calculateLastReply(ticket.updated_at),
        messages: formatMessages(ticket.messages || []),
      }));

      setTickets(formattedTickets);
      setFilteredTickets(formattedTickets);
    } catch (err) {
      setError("Failed to load tickets: " + err.message);
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateLastReply = (updatedAt) => {
    if (!updatedAt) return "Unknown";

    const now = new Date();
    const updated = new Date(updatedAt);
    const diffMs = now - updated;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const formatMessages = (messages) => {
    if (!messages || !Array.isArray(messages)) {
      return [];
    }

    return messages.map((msg, index) => ({
      id: index + 1,
      sender: msg.sender_name || "Support Agent",
      message: msg.message || msg.content || "No message content",
      timestamp: msg.created_at
        ? new Date(msg.created_at).toLocaleString()
        : new Date().toLocaleString(),
      type:
        msg.sender_type === "admin" || msg.sender_type === "agent"
          ? "agent"
          : "user",
    }));
  };

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

    if (priorityFilter !== "all") {
      result = result.filter((ticket) => ticket.priority === priorityFilter);
    }

    setFilteredTickets(result);
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  const getPriorityVariant = (priority) => {
    const variants = {
      low: "success",
      medium: "warning",
      high: "danger",
    };
    return variants[priority] || "secondary";
  };

  const getStatusVariant = (status) => {
    const variants = {
      open: "primary",
      "in-progress": "info",
      pending: "warning",
      resolved: "success",
      closed: "secondary",
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
      setUpdating(true);

      // Here you would typically make an API call to add a reply
      // For now, we'll update locally and you can implement the API call later
      const newMessage = {
        id: selectedTicket.messages.length + 1,
        sender: "Support Agent",
        message: replyMessage,
        timestamp: new Date().toLocaleString(),
        type: "agent",
      };

      const updatedTickets = tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              messages: [...ticket.messages, newMessage],
              status: "in-progress",
              updatedAt: new Date().toLocaleString(),
              lastReply: "Just now",
            }
          : ticket
      );

      setTickets(updatedTickets);
      setReplyMessage("");
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        status: "in-progress",
        updatedAt: new Date().toLocaleString(),
        lastReply: "Just now",
      });

      // TODO: Implement API call to save reply
      // await ticketApi.reply(selectedTicket.id, { message: replyMessage });
    } catch (err) {
      setError("Failed to send reply: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setUpdating(true);

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

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }

      // TODO: Implement API call to update status
      // await ticketApi.updateStatus(ticketId, newStatus);
    } catch (err) {
      setError("Failed to update status: " + err.message);
      // Revert on error
      fetchTickets();
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignTicket = async (ticketId, assignee) => {
    try {
      setUpdating(true);

      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              assignedTo: assignee,
              updatedAt: new Date().toLocaleString(),
            }
          : ticket
      );

      setTickets(updatedTickets);

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, assignedTo: assignee });
      }

      // TODO: Implement API call to assign ticket
      // await ticketApi.assign(ticketId, assignee);
    } catch (err) {
      setError("Failed to assign ticket: " + err.message);
      // Revert on error
      fetchTickets();
    } finally {
      setUpdating(false);
    }
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
              {loading ? <Spinner animation="border" size="sm" /> : "Refresh"}
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
              <Col md={4}>
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
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
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
                <Button variant="outline-primary" size="sm">
                  Export CSV
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Subject</th>
                  <th>User</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
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
                        <small className="text-muted">
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
                        <Badge bg="secondary" className="ms-1">
                          {ticket.user.type}
                        </Badge>
                      </div>
                    </td>
                    <td>
                      <Badge bg={getPriorityVariant(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(ticket.status)}>
                        {ticket.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </td>
                    <td>{ticket.assignedTo}</td>
                    <td>
                      <div>
                        <div>{ticket.updatedAt.split(" ")[0]}</div>
                        <small className="text-muted">{ticket.lastReply}</small>
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
                          >
                            ⋮
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusChange(ticket.id, "in-progress")
                              }
                              disabled={updating}
                            >
                              Mark In Progress
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusChange(ticket.id, "resolved")
                              }
                              disabled={updating}
                            >
                              Mark Resolved
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                handleAssignTicket(ticket.id, "Support Agent 1")
                              }
                              disabled={updating}
                            >
                              Assign to Me
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {filteredTickets.length === 0 && (
              <div className="text-center py-5">
                <div className="fs-1">📭</div>
                <p className="text-muted">
                  {tickets.length === 0
                    ? "No tickets found"
                    : "No tickets found matching your filters"}
                </p>
                {tickets.length > 0 && (
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
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
                    <strong>User:</strong> {selectedTicket.user.name} (
                    {selectedTicket.user.email})
                  </Col>
                  <Col md={3}>
                    <strong>Priority:</strong>{" "}
                    <Badge bg={getPriorityVariant(selectedTicket.priority)}>
                      {selectedTicket.priority.toUpperCase()}
                    </Badge>
                  </Col>
                  <Col md={3}>
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
                      disabled={updating}
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
              disabled={!replyMessage.trim() || updating}
            >
              {updating ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Send Reply"
              )}
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
