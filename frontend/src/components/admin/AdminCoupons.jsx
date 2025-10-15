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
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import AdminLayout from "../../pages/AdminPortal/AdminApp";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "discount",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minPurchase: "",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
    usageCount: 0,
    userLimit: "",
    planType: "all",
    status: "active",
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCoupons = [
      {
        id: 1,
        code: "WELCOME20",
        name: "Welcome Discount",
        description: "20% off for new users",
        type: "discount",
        discountType: "percentage",
        discountValue: 20,
        maxDiscount: 50,
        minPurchase: 0,
        validFrom: "2024-01-01",
        validUntil: "2024-12-31",
        usageLimit: 1000,
        usageCount: 247,
        userLimit: 1,
        planType: "all",
        status: "active",
        createdAt: "2024-01-01",
        createdBy: "Admin",
      },
      {
        id: 2,
        code: "FREETRIAL",
        name: "Free One Week Trial",
        description: "7-day free trial for new users",
        type: "trial",
        discountType: "trial",
        discountValue: 100,
        trialDays: 7,
        validFrom: "2024-01-01",
        validUntil: "2024-12-31",
        usageLimit: 5000,
        usageCount: 1289,
        userLimit: 1,
        planType: "premium",
        status: "active",
        createdAt: "2024-01-01",
        createdBy: "Admin",
      },
      {
        id: 3,
        code: "SUMMER25",
        name: "Summer Sale",
        description: "25% off summer promotion",
        type: "discount",
        discountType: "percentage",
        discountValue: 25,
        maxDiscount: 100,
        minPurchase: 50,
        validFrom: "2024-06-01",
        validUntil: "2024-08-31",
        usageLimit: 500,
        usageCount: 89,
        userLimit: 1,
        planType: "all",
        status: "active",
        createdAt: "2024-05-15",
        createdBy: "Marketing",
      },
      {
        id: 4,
        code: "FAMILY15",
        name: "Family Plan Discount",
        description: "15% off family plans",
        type: "discount",
        discountType: "percentage",
        discountValue: 15,
        maxDiscount: 75,
        minPurchase: 0,
        validFrom: "2024-03-01",
        validUntil: "2024-03-31",
        usageLimit: 100,
        usageCount: 100,
        userLimit: 1,
        planType: "family",
        status: "expired",
        createdAt: "2024-02-20",
        createdBy: "Sales",
      },
      {
        id: 5,
        code: "STUDENT10",
        name: "Student Discount",
        description: "10% off for students",
        type: "discount",
        discountType: "percentage",
        discountValue: 10,
        maxDiscount: 30,
        minPurchase: 0,
        validFrom: "2024-01-01",
        validUntil: "2024-12-31",
        usageLimit: 2000,
        usageCount: 456,
        userLimit: 1,
        planType: "all",
        status: "active",
        createdAt: "2024-01-01",
        createdBy: "Admin",
      },
    ];

    setCoupons(mockCoupons);
    setFilteredCoupons(mockCoupons);
  }, []);

  // Filter coupons
  useEffect(() => {
    let result = coupons;

    if (searchTerm) {
      result = result.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((coupon) => coupon.status === statusFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((coupon) => coupon.type === typeFilter);
    }

    setFilteredCoupons(result);
  }, [searchTerm, statusFilter, typeFilter, coupons]);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const handleCreateCoupon = () => {
    // Generate unique code if not provided
    const code = formData.code || generateCouponCode();

    const newCoupon = {
      id: coupons.length + 1,
      ...formData,
      code,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Admin",
    };

    setCoupons([...coupons, newCoupon]);
    setShowCreateModal(false);
    resetForm();
    showAlert("Coupon created successfully!");
  };

  const handleEditCoupon = () => {
    const updatedCoupons = coupons.map((coupon) =>
      coupon.id === selectedCoupon.id ? { ...coupon, ...formData } : coupon
    );

    setCoupons(updatedCoupons);
    setShowEditModal(false);
    resetForm();
    showAlert("Coupon updated successfully!");
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((coupon) => coupon.id !== id));
      showAlert("Coupon deleted successfully!");
    }
  };

  const handleDuplicateCoupon = (coupon) => {
    const duplicatedCoupon = {
      ...coupon,
      id: coupons.length + 1,
      code: generateCouponCode(),
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    setCoupons([...coupons, duplicatedCoupon]);
    showAlert("Coupon duplicated successfully!");
  };

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "discount",
      discountType: "percentage",
      discountValue: "",
      maxDiscount: "",
      minPurchase: "",
      validFrom: "",
      validUntil: "",
      usageLimit: "",
      usageCount: 0,
      userLimit: "",
      planType: "all",
      status: "active",
    });
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData(coupon);
    setShowEditModal(true);
  };

  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      expired: "warning",
      exhausted: "danger",
    };
    return variants[status] || "secondary";
  };

  const getTypeVariant = (type) => {
    const variants = {
      discount: "primary",
      trial: "info",
    };
    return variants[type] || "secondary";
  };

  const calculateUsagePercentage = (coupon) => {
    return Math.round((coupon.usageCount / coupon.usageLimit) * 100);
  };

  const isCouponValid = (coupon) => {
    const today = new Date().toISOString().split("T")[0];
    return (
      coupon.status === "active" &&
      coupon.validFrom <= today &&
      coupon.validUntil >= today &&
      coupon.usageCount < coupon.usageLimit
    );
  };

  const couponStats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === "active").length,
    discount: coupons.filter((c) => c.type === "discount").length,
    trial: coupons.filter((c) => c.type === "trial").length,
    expired: coupons.filter((c) => c.status === "expired").length,
  };

  const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    };

    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>{copied ? "Copied!" : "Copy to clipboard"}</Tooltip>}
      >
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleCopy}
          className="ms-2"
        >
          {copied ? "✓" : "📋"}
        </Button>
      </OverlayTrigger>
    );
  };

  return (
    <AdminLayout>
      <div className="admin-coupons">
        {/* Alert */}
        {alert.show && (
          <Alert
            variant={alert.type}
            dismissible
            onClose={() => setAlert({ show: false, message: "", type: "" })}
          >
            {alert.message}
          </Alert>
        )}

        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <h2>🎫 Coupons & Discount Codes</h2>
            <p className="text-muted">
              Manage discount codes and free trial promotions
            </p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              + Create Coupon
            </Button>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={2} sm={4} xs={6}>
            <Card className="text-center stat-card">
              <Card.Body>
                <h4 className="text-primary">{couponStats.total}</h4>
                <Card.Text>Total Coupons</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="text-center stat-card">
              <Card.Body>
                <h4 className="text-success">{couponStats.active}</h4>
                <Card.Text>Active</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="text-center stat-card">
              <Card.Body>
                <h4 className="text-info">{couponStats.discount}</h4>
                <Card.Text>Discount Codes</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="text-center stat-card">
              <Card.Body>
                <h4 className="text-warning">{couponStats.trial}</h4>
                <Card.Text>Free Trials</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="text-center stat-card">
              <Card.Body>
                <h4 className="text-danger">{couponStats.expired}</h4>
                <Card.Text>Expired</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="text-center stat-card">
              <Card.Body>
                <h4 className="text-secondary">
                  {coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0)}
                </h4>
                <Card.Text>Total Uses</Card.Text>
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
                  <Form.Label>Search Coupons</Form.Label>
                  <InputGroup>
                    <Form.Control
                      placeholder="Search by code, name, or description..."
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                    <option value="exhausted">Exhausted</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="discount">Discount Codes</option>
                    <option value="trial">Free Trials</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Coupons Table */}
        <Card>
          <Card.Header>
            <Row className="align-items-center">
              <Col>
                <Card.Title>Coupons ({filteredCoupons.length})</Card.Title>
              </Col>
              <Col xs="auto">
                <Button variant="outline-primary" size="sm">
                  Export CSV
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Discount/Offer</th>
                    <th>Usage</th>
                    <th>Validity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className={!isCouponValid(coupon) ? "table-warning" : ""}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <strong className="coupon-code">{coupon.code}</strong>
                          <CopyButton text={coupon.code} />
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{coupon.name}</div>
                          <small className="text-muted">
                            {coupon.description}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getTypeVariant(coupon.type)}>
                          {coupon.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        {coupon.type === "discount" ? (
                          <div>
                            <strong>{coupon.discountValue}%</strong>
                            {coupon.maxDiscount && (
                              <small className="text-muted">
                                {" "}
                                up to ${coupon.maxDiscount}
                              </small>
                            )}
                          </div>
                        ) : (
                          <div>
                            <strong>{coupon.trialDays} days free</strong>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="usage-progress">
                          <div className="d-flex justify-content-between small">
                            <span>
                              {coupon.usageCount}/{coupon.usageLimit}
                            </span>
                            <span>{calculateUsagePercentage(coupon)}%</span>
                          </div>
                          <div className="progress" style={{ height: "4px" }}>
                            <div
                              className={`progress-bar ${
                                calculateUsagePercentage(coupon) > 80
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                              style={{
                                width: `${calculateUsagePercentage(coupon)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <div>From: {coupon.validFrom}</div>
                          <div>To: {coupon.validUntil}</div>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusVariant(coupon.status)}>
                          {coupon.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                            id="dropdown-basic"
                          >
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => openEditModal(coupon)}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDuplicateCoupon(coupon)}
                            >
                              Duplicate
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="text-danger"
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {filteredCoupons.length === 0 && (
              <div className="text-center py-5">
                <div className="fs-1">🎫</div>
                <p className="text-muted">
                  No coupons found matching your filters
                </p>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Create Coupon Modal */}
        <Modal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Coupon</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CouponForm
              formData={formData}
              setFormData={setFormData}
              mode="create"
              generateCode={() =>
                setFormData({ ...formData, code: generateCouponCode() })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCoupon}>
              Create Coupon
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Coupon Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Coupon</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CouponForm
              formData={formData}
              setFormData={setFormData}
              mode="edit"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditCoupon}>
              Update Coupon
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

// Coupon Form Component
const CouponForm = ({ formData, setFormData, mode, generateCode }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Coupon Code *</Form.Label>
          <InputGroup>
            <Form.Control
              value={formData.code}
              onChange={(e) =>
                handleChange("code", e.target.value.toUpperCase())
              }
              placeholder="e.g., WELCOME20"
              required
            />
            {mode === "create" && (
              <Button variant="outline-secondary" onClick={generateCode}>
                Generate
              </Button>
            )}
          </InputGroup>
          <Form.Text className="text-muted">
            Unique code users will enter at checkout
          </Form.Text>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Coupon Name *</Form.Label>
          <Form.Control
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Welcome Discount"
            required
          />
        </Form.Group>
      </Col>

      <Col md={12}>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe what this coupon offers..."
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Coupon Type *</Form.Label>
          <Form.Select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="discount">Discount Code</option>
            <option value="trial">Free Trial</option>
          </Form.Select>
        </Form.Group>
      </Col>

      {formData.type === "discount" && (
        <>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Discount Type</Form.Label>
              <Form.Select
                value={formData.discountType}
                onChange={(e) => handleChange("discountType", e.target.value)}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Discount Value *</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    handleChange("discountValue", e.target.value)
                  }
                  placeholder={
                    formData.discountType === "percentage" ? "20" : "50"
                  }
                  required
                />
                <InputGroup.Text>
                  {formData.discountType === "percentage" ? "%" : "$"}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Maximum Discount</Form.Label>
              <Form.Control
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => handleChange("maxDiscount", e.target.value)}
                placeholder="Leave empty for no limit"
              />
            </Form.Group>
          </Col>
        </>
      )}

      {formData.type === "trial" && (
        <Col md={6}>
          <Form.Group>
            <Form.Label>Trial Days *</Form.Label>
            <Form.Control
              type="number"
              value={formData.trialDays || ""}
              onChange={(e) => handleChange("trialDays", e.target.value)}
              placeholder="7"
              required
            />
          </Form.Group>
        </Col>
      )}

      <Col md={6}>
        <Form.Group>
          <Form.Label>Minimum Purchase Amount</Form.Label>
          <Form.Control
            type="number"
            value={formData.minPurchase}
            onChange={(e) => handleChange("minPurchase", e.target.value)}
            placeholder="0"
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Valid From *</Form.Label>
          <Form.Control
            type="date"
            value={formData.validFrom}
            onChange={(e) => handleChange("validFrom", e.target.value)}
            required
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Valid Until *</Form.Label>
          <Form.Control
            type="date"
            value={formData.validUntil}
            onChange={(e) => handleChange("validUntil", e.target.value)}
            required
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Usage Limit *</Form.Label>
          <Form.Control
            type="number"
            value={formData.usageLimit}
            onChange={(e) => handleChange("usageLimit", e.target.value)}
            placeholder="1000"
            required
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Uses Per User</Form.Label>
          <Form.Control
            type="number"
            value={formData.userLimit}
            onChange={(e) => handleChange("userLimit", e.target.value)}
            placeholder="1"
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Applicable Plan</Form.Label>
          <Form.Select
            value={formData.planType}
            onChange={(e) => handleChange("planType", e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="basic">Basic Plan</option>
            <option value="premium">Premium Plan</option>
            <option value="family">Family Plan</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default AdminCoupons;
