// components/AdminCoupons.js
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
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { couponApi } from "../../services/couponApi";


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
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state - matching your API structure
  const [formData, setFormData] = useState({
    coupon_code: "",
    coupon_name: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    max_discount: "",
    min_purchase_amount: "",
    valid_from: "",
    valid_until: "",
    usage_limit: "",
    subscription_id: "",
    status: "active",
  });

  // Fetch coupons from API
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponApi.getAllCoupons();
      setCoupons(response.data || []);
      setFilteredCoupons(response.data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      showAlert("Failed to fetch coupons", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter coupons
  useEffect(() => {
    let result = coupons;

    if (searchTerm) {
      result = result.filter(
        (coupon) =>
          coupon.coupon_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coupon.coupon_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((coupon) => 
        coupon.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((coupon) => 
        coupon.discount_type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    setFilteredCoupons(result);
  }, [searchTerm, statusFilter, typeFilter, coupons]);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const handleCreateCoupon = async () => {
    setActionLoading(true);
    try {
      // Format data for API
      const apiData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : 0,
        usage_limit: parseInt(formData.usage_limit),
        subscription_id: formData.subscription_id ? parseInt(formData.subscription_id) : null,
      };

      await couponApi.createCoupon(apiData);
      setShowCreateModal(false);
      resetForm();
      fetchCoupons(); // Refresh the list
      showAlert("Coupon created successfully!");
    } catch (error) {
      console.error("Error creating coupon:", error);
      showAlert("Failed to create coupon", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCoupon = async () => {
    if (!selectedCoupon) return;
    
    setActionLoading(true);
    try {
      const apiData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : 0,
        usage_limit: parseInt(formData.usage_limit),
        subscription_id: formData.subscription_id ? parseInt(formData.subscription_id) : null,
      };

      await couponApi.updateCoupon(selectedCoupon.id, apiData);
      setShowEditModal(false);
      resetForm();
      fetchCoupons(); // Refresh the list
      showAlert("Coupon updated successfully!");
    } catch (error) {
      console.error("Error updating coupon:", error);
      showAlert("Failed to update coupon", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await couponApi.deleteCoupon(id);
        fetchCoupons(); // Refresh the list
        showAlert("Coupon deleted successfully!");
      } catch (error) {
        console.error("Error deleting coupon:", error);
        showAlert("Failed to delete coupon", "danger");
      }
    }
  };

  const handleDuplicateCoupon = async (coupon) => {
    try {
      const duplicatedCoupon = {
        ...coupon,
        coupon_code: generateCouponCode(),
        usage_count: 0,
        status: "ACTIVE",
      };

      delete duplicatedCoupon.id;
      delete duplicatedCoupon.created_at;
      delete duplicatedCoupon.updated_at;

      await couponApi.createCoupon(duplicatedCoupon);
      fetchCoupons(); // Refresh the list
      showAlert("Coupon duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating coupon:", error);
      showAlert("Failed to duplicate coupon", "danger");
    }
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
      coupon_code: "",
      coupon_name: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      max_discount: "",
      min_purchase_amount: "",
      valid_from: "",
      valid_until: "",
      usage_limit: "",
      subscription_id: "",
      status: "active",
    });
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      coupon_code: coupon.coupon_code,
      coupon_name: coupon.coupon_name,
      description: coupon.description,
      discount_type: coupon.discount_type?.toLowerCase(),
      discount_value: coupon.discount_value,
      max_discount: coupon.max_discount,
      min_purchase_amount: coupon.min_purchase_amount,
      valid_from: coupon.valid_from?.split('T')[0],
      valid_until: coupon.valid_until?.split('T')[0],
      usage_limit: coupon.usage_limit,
      subscription_id: coupon.subscription_id,
      status: coupon.status?.toLowerCase(),
    });
    setShowEditModal(true);
  };

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    const variants = {
      active: "success",
      inactive: "secondary",
      expired: "warning",
      exhausted: "danger",
    };
    return variants[statusLower] || "secondary";
  };

  const getTypeVariant = (type) => {
    const typeLower = type?.toLowerCase();
    const variants = {
      percentage: "primary",
      fixed: "info",
    };
    return variants[typeLower] || "secondary";
  };

  const isCouponValid = (coupon) => {
    const today = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);
    
    return (
      coupon.status === "ACTIVE" &&
      today >= validFrom &&
      today <= validUntil
    );
  };

  const couponStats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === "ACTIVE").length,
    percentage: coupons.filter((c) => c.discount_type === "PERCENTAGE").length,
    fixed: coupons.filter((c) => c.discount_type === "FIXED").length,
    expired: coupons.filter((c) => {
      const today = new Date();
      const validUntil = new Date(c.valid_until);
      return today > validUntil;
    }).length,
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <AdminLayout>
      
    </AdminLayout>
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
            Manage discount codes and promotions
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
              <h4 className="text-info">{couponStats.percentage}</h4>
              <Card.Text>Percentage</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={4} xs={6}>
          <Card className="text-center stat-card">
            <Card.Body>
              <h4 className="text-warning">{couponStats.fixed}</h4>
              <Card.Text>Fixed Amount</Card.Text>
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
                {coupons.reduce((sum, coupon) => sum + (coupon.usage_count || 0), 0)}
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
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Discount Type</Form.Label>
                <Form.Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
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
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={fetchCoupons}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
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
                  <th>Discount</th>
                  <th>Min Purchase</th>
                  <th>Validity</th>
                  <th>Usage</th>
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
                        <strong className="coupon-code">{coupon.coupon_code}</strong>
                        <CopyButton text={coupon.coupon_code} />
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">{coupon.coupon_name}</div>
                        <small className="text-muted">
                          {coupon.description}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge bg={getTypeVariant(coupon.discount_type)}>
                        {coupon.discount_type}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <strong>
                          {coupon.discount_type === "PERCENTAGE" 
                            ? `${coupon.discount_value}%`
                            : `$${coupon.discount_value}`
                          }
                        </strong>
                        {coupon.max_discount && coupon.discount_type === "PERCENTAGE" && (
                          <small className="text-muted d-block">
                            Max: ${coupon.max_discount}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      ${coupon.min_purchase_amount || "0"}
                    </td>
                    <td>
                      <div className="small">
                        <div>From: {new Date(coupon.valid_from).toLocaleDateString()}</div>
                        <div>To: {new Date(coupon.valid_until).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td>
                      <div className="small">
                        <div>{coupon.usage_count || 0} / {coupon.usage_limit}</div>
                        {coupon.usage_limit > 0 && (
                          <ProgressBar 
                            now={((coupon.usage_count || 0) / coupon.usage_limit) * 100}
                            variant={((coupon.usage_count || 0) / coupon.usage_limit) > 0.8 ? "warning" : "success"}
                            style={{ height: "4px" }}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(coupon.status)}>
                        {coupon.status}
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
                {coupons.length === 0 ? "No coupons created yet" : "No coupons found matching your filters"}
              </p>
              {coupons.length === 0 && (
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Your First Coupon
                </Button>
              )}
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
              setFormData({ ...formData, coupon_code: generateCouponCode() })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCreateModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateCoupon}
            disabled={actionLoading}
          >
            {actionLoading ? "Creating..." : "Create Coupon"}
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
          <Button 
            variant="secondary" 
            onClick={() => setShowEditModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditCoupon}
            disabled={actionLoading}
          >
            {actionLoading ? "Updating..." : "Update Coupon"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
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
              value={formData.coupon_code}
              onChange={(e) =>
                handleChange("coupon_code", e.target.value.toUpperCase())
              }
              placeholder="e.g., EID51"
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
            value={formData.coupon_name}
            onChange={(e) => handleChange("coupon_name", e.target.value)}
            placeholder="e.g., Eid Discount"
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
          <Form.Label>Discount Type *</Form.Label>
          <Form.Select
            value={formData.discount_type}
            onChange={(e) => handleChange("discount_type", e.target.value)}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Discount Value *</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              step="0.01"
              value={formData.discount_value}
              onChange={(e) => handleChange("discount_value", e.target.value)}
              placeholder={formData.discount_type === "percentage" ? "50" : "25"}
              required
            />
            <InputGroup.Text>
              {formData.discount_type === "percentage" ? "%" : "$"}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
      </Col>

      {formData.discount_type === "percentage" && (
        <Col md={6}>
          <Form.Group>
            <Form.Label>Maximum Discount ($)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={formData.max_discount}
              onChange={(e) => handleChange("max_discount", e.target.value)}
              placeholder="100"
            />
            <Form.Text className="text-muted">
              Leave empty for no maximum limit
            </Form.Text>
          </Form.Group>
        </Col>
      )}

      <Col md={formData.discount_type === "percentage" ? 6 : 12}>
        <Form.Group>
          <Form.Label>Minimum Purchase Amount ($)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={formData.min_purchase_amount}
            onChange={(e) => handleChange("min_purchase_amount", e.target.value)}
            placeholder="0"
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Valid From *</Form.Label>
          <Form.Control
            type="date"
            value={formData.valid_from}
            onChange={(e) => handleChange("valid_from", e.target.value)}
            required
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Valid Until *</Form.Label>
          <Form.Control
            type="date"
            value={formData.valid_until}
            onChange={(e) => handleChange("valid_until", e.target.value)}
            required
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Usage Limit *</Form.Label>
          <Form.Control
            type="number"
            value={formData.usage_limit}
            onChange={(e) => handleChange("usage_limit", e.target.value)}
            placeholder="100"
            required
          />
          <Form.Text className="text-muted">
            Maximum number of times this coupon can be used
          </Form.Text>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group>
          <Form.Label>Subscription ID</Form.Label>
          <Form.Control
            type="number"
            value={formData.subscription_id}
            onChange={(e) => handleChange("subscription_id", e.target.value)}
            placeholder="2"
          />
          <Form.Text className="text-muted">
            Leave empty if applicable to all subscriptions
          </Form.Text>
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