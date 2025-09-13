import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaCreditCard,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Subscription = () => {
  // Example billing history
  const invoices = [
    {
      id: 1,
      date: "2025-08-01",
      amount: "$20",
      status: "Paid",
      method: "Visa **** 1234",
    },
    {
      id: 2,
      date: "2025-07-01",
      amount: "$20",
      status: "Paid",
      method: "PayPal",
    },
    {
      id: 3,
      date: "2025-06-01",
      amount: "$20",
      status: "Failed",
      method: "MasterCard **** 5678",
    },
  ];

  // Generate professional PDF invoice
  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();

    // Company Logo (replace with your logo)
    const logoUrl =
      "https://services.enfieldroyalclinic.com/wp-content/uploads/2025/08/enfield-royal-clinic-logo-1.png";
    doc.addImage(logoUrl, "PNG", 14, 10, 30, 15);

    // Header
    doc.setFontSize(18);
    doc.text("Invoice", 150, 20);

    // Company Info
    doc.setFontSize(11);
    doc.text("Parent Portal", 14, 35);
    doc.text("support@parentportal.com", 14, 42);
    doc.text("www.parentportal.com", 14, 49);

    // Invoice Info
    doc.text(`Invoice ID: #${invoice.id}`, 150, 35);
    doc.text(`Date: ${invoice.date}`, 150, 42);
    doc.text(`Payment Method: ${invoice.method}`, 150, 49);

    // Table
    doc.autoTable({
      startY: 60,
      head: [["Description", "Amount", "Status", "Payment Method"]],
      body: [
        [
          "Premium Subscription Plan (Monthly)",
          invoice.amount,
          invoice.status,
          invoice.method,
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text("Thank you for your subscription!", 14, pageHeight - 20);
    doc.text("This is a computer-generated invoice.", 14, pageHeight - 14);

    doc.save(`invoice-${invoice.id}.pdf`);
  };

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">💳 Subscriptions & Billing</h2>

      <Row>
        {/* Current Plan */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Your Current Plan</h5>
              <p className="text-muted mb-1">
                Plan: <strong>Premium</strong>
              </p>
              <p className="text-muted mb-1">
                Price: <strong>$20 / month</strong>
              </p>
              <p className="text-muted mb-3">
                Next Billing: <strong>Oct 1, 2025</strong>
              </p>
              <Button variant="primary" className="me-2">
                Upgrade Plan
              </Button>
              <Button variant="outline-danger">Cancel</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Payment Settings */}
        <Col md={6} lg={8} className="mb-4">
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Payment Settings</h5>
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="cardName">
                      <Form.Label>Cardholder Name</Form.Label>
                      <Form.Control type="text" placeholder="John Doe" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="cardNumber">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="**** **** **** 1234"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="expiry">
                      <Form.Label>Expiry</Form.Label>
                      <Form.Control type="text" placeholder="MM/YY" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control type="password" placeholder="***" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  variant="success"
                  className="mt-3 d-flex align-items-center gap-2"
                >
                  <FaCreditCard /> Update Payment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Billing History */}
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body>
          <h5 className="fw-semibold mb-3">Billing History</h5>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.amount}</td>
                  <td>
                    {inv.status === "Paid" ? (
                      <span className="text-success d-flex align-items-center gap-1">
                        <FaCheckCircle /> {inv.status}
                      </span>
                    ) : (
                      <span className="text-danger d-flex align-items-center gap-1">
                        <FaTimesCircle /> {inv.status}
                      </span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={() => generateInvoicePDF(inv)}
                    >
                      <FaDownload /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Subscription;
