import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaCreditCard,
  FaExclamationTriangle,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useUser } from "../../../context/UserContext";
import { getsubscriptionsParentByidApi } from "../../../services/subscribeApi";


const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Fetch subscription data using the API function
  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user || !user.id) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      // Use the imported API function
      const subscriptionResponse = await getsubscriptionsParentByidApi(user.id);

      if (subscriptionResponse.data) {
        setSubscription(subscriptionResponse.data);
        // Generate invoices based on subscription data
        generateInvoicesFromSubscription(subscriptionResponse.data);
      } else {
        setSubscription(null);
        setInvoices([]);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      if (err.response?.status === 404) {
        setSubscription(null);
        setInvoices([]);
      } else {
        setError("Failed to load subscription data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate mock invoices based on subscription data
  const generateInvoicesFromSubscription = (subData) => {
    if (!subData) {
      setInvoices([]);
      return;
    }

    const mockInvoices = [];
    const startDate = new Date(subData.start_date);
    const price = parseFloat(subData.price);

    // Generate invoices for the last 3 months
    for (let i = 0; i < 3; i++) {
      const invoiceDate = new Date();
      invoiceDate.setMonth(invoiceDate.getMonth() - i);

      mockInvoices.push({
        id: i + 1,
        date: invoiceDate.toISOString().split("T")[0],
        amount: `$${price.toFixed(2)}`,
        status: i === 2 ? "Failed" : "Paid", // Make the oldest one failed for demo
        method: i % 2 === 0 ? "Visa **** 1234" : "PayPal",
        plan_name: subData.plan_name,
      });
    }

    setInvoices(mockInvoices.reverse());
  };

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

    // Customer Info
    doc.text(`Customer: ${user?.name || "N/A"}`, 14, 60);
    doc.text(`Email: ${user?.email || "N/A"}`, 14, 67);

    // Invoice Info
    doc.text(`Invoice ID: #${invoice.id}`, 150, 35);
    doc.text(`Date: ${invoice.date}`, 150, 42);
    doc.text(`Payment Method: ${invoice.method}`, 150, 49);

    // Table
    doc.autoTable({
      startY: 75,
      head: [["Description", "Amount", "Status", "Payment Method"]],
      body: [
        [
          `${invoice.plan_name} (Monthly)`,
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

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate next billing date
  const getNextBillingDate = () => {
    if (!subscription) return null;

    const endDate = new Date(subscription.end_date);
    const now = new Date();

    // If subscription is active and end date is in future, use end date
    if (subscription.is_active && endDate > now) {
      return formatDate(endDate);
    }

    // Otherwise, calculate next month from now
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return formatDate(nextMonth);
  };

  // Handle subscription actions
  const handleUpgradePlan = () => {
    // Implement upgrade logic here
    console.log("Upgrade plan clicked");
  };

  const handleCancelSubscription = () => {
    // Implement cancel logic here
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      console.log("Cancel subscription clicked");
    }
  };

  const handleUpdatePayment = () => {
    // Implement payment update logic here
    console.log("Update payment clicked");
  };

  const handleSubscribeNow = () => {
    // Implement subscribe logic here
    console.log("Subscribe now clicked");
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading subscription data...</span>
        </div>
      </Container>
    );
  }

  if (error && !subscription) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-3"
            onClick={fetchSubscriptionData}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">💳 Subscriptions & Billing</h2>

      <Row>
        {/* Current Plan */}
        <Col md={6} lg={4} className="mb-4">
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Your Current Plan</h5>

              {subscription && subscription.is_active ? (
                <>
                  <p className="text-muted mb-1">
                    Plan: <strong>{subscription.plan_name}</strong>
                  </p>
                  <p className="text-muted mb-1">
                    Price:{" "}
                    <strong>
                      ${parseFloat(subscription.price).toFixed(2)} / month
                    </strong>
                  </p>
                  <p className="text-muted mb-1">
                    Max Children: <strong>{subscription.max_children}</strong>
                  </p>
                  <p className="text-muted mb-1">
                    Start Date:{" "}
                    <strong>{formatDate(subscription.start_date)}</strong>
                  </p>
                  <p className="text-muted mb-3">
                    Next Billing: <strong>{getNextBillingDate()}</strong>
                  </p>
                  <div className="text-success d-flex align-items-center gap-1 mb-3">
                    <FaCheckCircle /> Active
                  </div>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={handleUpgradePlan}
                  >
                    Upgrade Plan
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={handleCancelSubscription}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <div className="text-center py-3">
                  <FaTimesCircle className="text-danger mb-2" size={24} />
                  <p className="text-muted">No active subscription</p>
                  <Button variant="primary" onClick={handleSubscribeNow}>
                    Subscribe Now
                  </Button>
                </div>
              )}
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
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        defaultValue={user?.name || ""}
                      />
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
                  onClick={handleUpdatePayment}
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
          {invoices.length > 0 ? (
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
                    <td>{formatDate(inv.date)}</td>
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
          ) : subscription ? (
            <div className="text-center py-4 text-muted">
              No billing history available for your subscription.
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              No subscription found. Subscribe to see billing history.
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Subscription;
