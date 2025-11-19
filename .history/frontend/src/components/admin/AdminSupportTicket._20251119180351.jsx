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
import ticketApi from "../../services/ticketApi";

const AdminSupportTicket = () => {
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

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ticketApi.getAll();
      
      const transformedTickets = response.tickets?.map((ticket) => {
        const getUserName = () => {
          if (ticket.name) return ticket.name;
          if (ticket.user?.name) return ticket.user.name;
          return "Unknown User";
        };

        const userName = getUserName();

        return {
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          subject: ticket.subject || "No Subject",
          description: ticket.description || "No description provided",
          user: { name: userName },
          status: ticket.status?.toLowerCase() || "open",
          createdAt: new Date(ticket.created_at).toLocaleString(),
          updatedAt: new Date(ticket.updated_at).toLocaleString(),
          lastReply: calculateLastReply(ticket.updated_at),
          messages: ticket.messages?.map((msg) => ({
            id: msg._id || msg.id,
            sender: msg.sender === "agent" ? "Support Agent" : userName,
            message: msg.message || msg.content,
            timestamp: new Date(msg.timestamp).toLocaleString(),
            type: msg.sender === "agent" ? "agent" : "user",
          })) || [
            {
              id: 1,
              sender: userName,
              message: ticket.description || "No message",
              timestamp: new Date(ticket.created_at).toLocaleString(),
              type: "user",
            },
          ],
        };
      }) || [];

      setTickets(transformedTickets);
    } catch (err) {
      setError(err.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let result = tickets;

    if (searchTerm) {
      result = result.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      const newMessage = {
        sender: "agent",
        message: replyMessage,
        timestamp: new Date().toISOString(),
      };

      await ticketApi.update(selectedTicket.id, {
        messages: [...selectedTicket.messages, newMessage],
        status: "in-progress",
      });

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

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setActionLoading(true);

      if (newStatus === "resolved") {
        await ticketApi.markAsResolved(ticketId);
      } else if (newStatus === "in-progress") {
        await ticketApi.markAsInProgress(ticketId);
      } else {
        await ticketApi.update(ticketId, { status: newStatus });
      }

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
        setSelectedTicket({
          ...selectedTicket,
          status: newStatus,
          updatedAt: new Date().toLocaleString(),
        });
      }
    } catch (err) {
      setError("Failed to update ticket status: " + err.message);
      fetchTickets();
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCSV = () => {
    if (tickets.length === 0) return;

    const headers = [
      "Ticket Number",
      "Subject",
      "User Name",
      "Status",
      "Created At",
      "Last Updated",
    ];

    const csvData = tickets.map((ticket) => [
      ticket.ticketNumber,
      `"${ticket.subject.replace(/"/g, '""')}"`,
      `"${ticket.user.name.replace(/"/g, '""')}"`,
      ticket.status,
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
    link.setAttribute("download", `support-tickets-${new Date().toISOString().split("T")[0]}.csv`);
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
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading tickets...</span>
          </Spinner>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-support-ticket p-3">
        <Row className="mb-4">
          <Col>
            <h2>🎫 Support Tickets</h2>
            <p className="text-muted">Manage customer support requests</p>
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

        <Row className="mb-4">
          <Col md={3}><Card className="text-center"><Card.Body><h4 className="text-primary">{ticketStats.total}</h4><Card.Text>Total</Card.Text></Card.Body></Card></Col>
          <Col md={3}><Card className="text-center"><Card.Body><h4 className="text-warning">{ticketStats.open}</h4><Card.Text>Open</Card.Text></Card.Body></Card></Col>
          <Col md={3}><Card className="text-center"><Card.Body><h4 className="text-info">{ticketStats.inProgress}</h4><Card.Text>In Progress</Card.Text></Card.Body></Card></Col>
          <Col md={3}><Card className="text-center"><Card.Body><h4 className="text-success">{ticketStats.resolved}</h4><Card.Text>Resolved</Card.Text></Card.Body></Card></Col>
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Search Tickets</Form.Label>
                  <InputGroup>
                    <Form.Control
                      placeholder="Search by subject, ticket number, or user name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="outline-secondary" onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Row className="align-items-center">
              <Col><Card.Title>Tickets ({filteredTickets.length})</Card.Title></Col>
              <Col xs="auto">
                <Button variant="outline-primary" size="sm" onClick={exportToCSV}>Export CSV</Button>
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
                      <td><strong>{ticket.ticketNumber}</strong></td>
                      <td>
                        <div className="fw-bold">{ticket.subject}</div>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: "200px" }}>
                          {ticket.description}
                        </small>
                      </td>
                      <td>{ticket.user.name}</td>
                      <td>
                        <Badge bg={getStatusVariant(ticket.status)}>
                          {ticket.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        <div>{ticket.updatedAt.split(",")[0]}</div>
                        <small className="text-muted">{ticket.lastReply}</small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button variant="outline-primary" size="sm" onClick={() => handleViewTicket(ticket)}>
                            View
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm" disabled={actionLoading}>
                              {actionLoading ? <Spinner size="sm" /> : "⋮"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleStatusChange(ticket.id, "in-progress")} disabled={ticket.status === "in-progress"}>
                                Mark In Progress
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleStatusChange(ticket.id, "resolved")} disabled={ticket.status === "resolved"}>
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
                  {tickets.length === 0 ? "No tickets found" : "No tickets matching filters"}
                </p>
                <Button 
                  variant={tickets.length === 0 ? "primary" : "outline-primary"} 
                  onClick={tickets.length === 0 ? fetchTickets : () => { setSearchTerm(""); setStatusFilter("all"); }}
                >
                  {tickets.length === 0 ? "Try Again" : "Clear Filters"}
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedTicket?.ticketNumber} - {selectedTicket?.subject}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {selectedTicket && (
              <div>
                <Row className="mb-4">
                  <Col><strong>User:</strong> {selectedTicket.user.name}</Col>
                  <Col>
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusVariant(selectedTicket.status)}>
                      {selectedTicket.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </Col>
                </Row>

                <div className="messages-container">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={`message ${message.type === "agent" ? "agent-message" : "user-message"}`}>
                      <div className="message-header">
                        <strong>{message.sender}</strong>
                        <small className="text-muted">{message.timestamp}</small>
                      </div>
                      <div className="message-content">{message.message}</div>
                    </div>
                  ))}
                </div>

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
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleReply} disabled={!replyMessage.trim() || actionLoading}>
              {actionLoading ? "Sending..." : "Send Reply"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <style jsx>{`
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