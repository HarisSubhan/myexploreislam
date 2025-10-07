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
} from "react-bootstrap";
import AdminLayout from "../../pages/AdminPortal/AdminApp";

const AdminSupportTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  // Mock data - replace with API calls
  useEffect(() => {
    const mockTickets = [
      {
        id: 1,
        ticketNumber: "TKT-2024-001",
        subject: "Video playback issue",
        description: "Videos are buffering constantly and not playing smoothly",
        user: {
          name: "Sarah Johnson",
          email: "sarah@example.com",
          type: "parent",
        },
        priority: "high",
        status: "open",
        category: "technical",
        assignedTo: "Support Agent 1",
        createdAt: "2024-01-15 14:30",
        updatedAt: "2024-01-15 16:45",
        lastReply: "2 hours ago",
        messages: [
          {
            id: 1,
            sender: "Sarah Johnson",
            message:
              "Hello, I'm having trouble with video playback. The videos keep buffering every few seconds.",
            timestamp: "2024-01-15 14:30",
            type: "user",
          },
          {
            id: 2,
            sender: "Support Agent 1",
            message:
              "We're looking into this issue. Can you tell us what device and browser you're using?",
            timestamp: "2024-01-15 15:15",
            type: "agent",
          },
        ],
      },
      {
        id: 2,
        ticketNumber: "TKT-2024-002",
        subject: "Billing question",
        description: "Charged twice for this month's subscription",
        user: { name: "Mike Chen", email: "mike@example.com", type: "parent" },
        priority: "medium",
        status: "in-progress",
        category: "billing",
        assignedTo: "Finance Team",
        createdAt: "2024-01-14 09:15",
        updatedAt: "2024-01-15 10:20",
        lastReply: "1 day ago",
        messages: [
          {
            id: 1,
            sender: "Mike Chen",
            message:
              "I was charged twice for my subscription this month. Can you help refund one charge?",
            timestamp: "2024-01-14 09:15",
            type: "user",
          },
        ],
      },
      {
        id: 3,
        ticketNumber: "TKT-2024-003",
        subject: "Course content missing",
        description: "Math fundamentals course shows as empty",
        user: {
          name: "Emma Davis",
          email: "emma@example.com",
          type: "teacher",
        },
        priority: "medium",
        status: "resolved",
        category: "content",
        assignedTo: "Content Team",
        createdAt: "2024-01-13 11:45",
        updatedAt: "2024-01-14 16:30",
        lastReply: "2 days ago",
        messages: [
          {
            id: 1,
            sender: "Emma Davis",
            message:
              "The Math Fundamentals course appears to be empty with no lessons.",
            timestamp: "2024-01-13 11:45",
            type: "user",
          },
          {
            id: 2,
            sender: "Content Team",
            message:
              "This has been fixed. The course content is now available.",
            timestamp: "2024-01-14 16:30",
            type: "agent",
          },
        ],
      },
      {
        id: 4,
        ticketNumber: "TKT-2024-004",
        subject: "Account login problem",
        description: "Cannot login to parent account",
        user: {
          name: "David Wilson",
          email: "david@example.com",
          type: "parent",
        },
        priority: "high",
        status: "open",
        category: "account",
        assignedTo: "Support Agent 2",
        createdAt: "2024-01-15 08:20",
        updatedAt: "2024-01-15 08:20",
        lastReply: "Just now",
        messages: [
          {
            id: 1,
            sender: "David Wilson",
            message:
              'I\'m unable to login to my parent account. Getting "invalid credentials" error.',
            timestamp: "2024-01-15 08:20",
            type: "user",
          },
        ],
      },
      {
        id: 5,
        ticketNumber: "TKT-2024-005",
        subject: "Child progress not updating",
        description: "Progress bar stuck at 75% for a week",
        user: { name: "Lisa Brown", email: "lisa@example.com", type: "parent" },
        priority: "low",
        status: "pending",
        category: "technical",
        assignedTo: "Not assigned",
        createdAt: "2024-01-14 16:40",
        updatedAt: "2024-01-14 16:40",
        lastReply: "1 day ago",
        messages: [
          {
            id: 1,
            sender: "Lisa Brown",
            message:
              "My child's progress bar has been stuck at 75% for over a week.",
            timestamp: "2024-01-14 16:40",
            type: "user",
          },
        ],
      },
    ];

    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
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

  const handleReply = () => {
    if (!replyMessage.trim()) return;

    // Add new reply to the ticket
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
  };

  const handleStatusChange = (ticketId, newStatus) => {
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
  };

  const handleAssignTicket = (ticketId, assignee) => {
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
  };

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

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
            <Button variant="primary">+ New Ticket</Button>
          </Col>
        </Row>

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
                            >
                              Mark In Progress
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleStatusChange(ticket.id, "resolved")
                              }
                            >
                              Mark Resolved
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                handleAssignTicket(ticket.id, "Support Agent 1")
                              }
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
                  No tickets found matching your filters
                </p>
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
            <Button variant="primary" onClick={handleReply}>
              Send Reply
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
