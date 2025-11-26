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