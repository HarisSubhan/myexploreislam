import React, { useState } from "react";
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
} from "react-bootstrap";
import {
  FaPlusCircle,
  FaTicketAlt,
  FaQuestionCircle,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const ParentSupports = () => {
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 1, subject: "Payment issue", status: "Open", date: "2025-09-01" },
    {
      id: 2,
      subject: "Child profile not loading",
      status: "In Progress",
      date: "2025-09-05",
    },
    {
      id: 3,
      subject: "Report download problem",
      status: "Resolved",
      date: "2025-09-10",
    },
  ]);

  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });

  const handleOpenTicket = () => setShowModal(true);
  const handleCloseTicket = () => setShowModal(false);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setTickets([
      ...tickets,
      {
        id: tickets.length + 1,
        subject: newTicket.subject,
        status: "Open",
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setNewTicket({ subject: "", description: "" });
    setShowModal(false);
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      <h2 className="fw-bold mb-4 text-primary">Support Center</h2>

      <Row className="g-4">
        {/* Tickets Section */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 rounded-3 h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaTicketAlt size={22} className="text-primary me-2" />
                <h5 className="fw-bold m-0">Tickets</h5>
              </div>

              <div className="d-flex justify-content-end mb-3">
                <Button
                  variant="primary"
                  onClick={handleOpenTicket}
                  className="d-flex align-items-center"
                >
                  <FaPlusCircle className="me-2" />
                  Open Ticket
                </Button>
              </div>

              <Table
                hover
                responsive
                bordered
                className="align-middle text-center"
              >
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td className="text-start">{ticket.subject}</td>
                      <td>
                        {ticket.status === "Resolved" ? (
                          <span className="badge bg-success d-flex align-items-center justify-content-center gap-1">
                            <FaCheckCircle /> {ticket.status}
                          </span>
                        ) : ticket.status === "In Progress" ? (
                          <span className="badge bg-warning text-dark d-flex align-items-center justify-content-center gap-1">
                            ⏳ {ticket.status}
                          </span>
                        ) : (
                          <span className="badge bg-danger d-flex align-items-center justify-content-center gap-1">
                            <FaTimesCircle /> {ticket.status}
                          </span>
                        )}
                      </td>
                      <td>{ticket.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* FAQs Section */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 rounded-3 h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaQuestionCircle size={22} className="text-primary me-2" />
                <h5 className="fw-bold m-0">FAQs</h5>
              </div>

              <Accordion defaultActiveKey="0">
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
                    Visit <b>Subscriptions & Billing</b> to change your plan or
                    payment method.
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
            </Card.Body>
          </Card>
        </Col>

        
      </Row>

      {/* Ticket Modal */}
      <Modal show={showModal} onHide={handleCloseTicket} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold d-flex align-items-center">
            <FaPlusCircle className="me-2 text-primary" />
            Open a New Ticket
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTicket}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, subject: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your issue"
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 fw-bold">
              Submit Ticket
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ParentSupports;
