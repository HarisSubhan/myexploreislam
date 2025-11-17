import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaTicketAlt, FaInfoCircle } from "react-icons/fa";
import { getTicketsApi, createTicketApi } from "../../../services/ticketApi";
import "./ParentSupports.css";

const ParentSupports = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTicketsApi();
      setTickets(response.data || []);
    } catch (err) {
      setError("Failed to fetch tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject || !description) {
      setError("Please fill all fields.");
      return;
    }

    setError("");
    try {
      await createTicketApi({ subject, description });
      setSuccessMessage("Ticket created successfully!");
      setShowModal(false);
      setSubject("");
      setDescription("");
      fetchTickets();
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  return (
    <Container fluid className="parent-supports-container mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
              <h5 className="mb-0">
                <FaTicketAlt className="me-2" /> Support Tickets
              </h5>
              <Button variant="success" onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" /> New Ticket
              </Button>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading tickets...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : tickets.length === 0 ? (
                <Alert variant="info">No tickets found.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover bordered className="align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket, index) => (
                        <tr key={ticket._id}>
                          <td>{index + 1}</td>
                          <td>{ticket.subject}</td>
                          <td>
                            <span
                              className={`badge ${
                                ticket.status === "open"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleViewDetails(ticket)}
                            >
                              <FaInfoCircle className="me-1" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {successMessage && (
                <Alert
                  variant="success"
                  onClose={() => setSuccessMessage("")}
                  dismissible
                  className="mt-3"
                >
                  {successMessage}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* === Create Ticket Modal === */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTicket}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Submit Ticket
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* === Ticket Details Modal === */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket ? (
            <>
              <p>
                <strong>Subject:</strong> {selectedTicket.subject}
              </p>
              <p>
                <strong>Description:</strong> {selectedTicket.description}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    selectedTicket.status === "open"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedTicket.createdAt).toLocaleString()}
              </p>
            </>
          ) : (
            <p>No ticket selected.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ParentSupports;
