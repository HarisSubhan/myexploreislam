// components/ChildFormModal.js
import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Alert, Button, Image } from "react-bootstrap";

// Available avatars
const AVAILABLE_AVATARS = [
  "avatar1",
  "avatar2", 
];

const ChildFormModal = ({ show, onHide, onSave, editing, submitting }) => {
  const [form, setForm] = useState({
    id: null,
    name: "",
    age: "",
    email: "",
    username: "",
    password: "",
    progress: 0,
    avatar: "avatar1",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    setForm({
      id: editing?.id ?? null,
      name: editing?.name ?? "",
      age: editing?.age ?? "",
      email: editing?.email ?? "",
      username: editing?.username ?? "",
      password: "",
      progress: editing?.progress ?? 0,
      avatar: editing?.avatar ?? "avatar1",
    });
    setErrors({});
    setApiError(null);
  }, [editing]);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name required";
    if (!form.age || isNaN(Number(form.age))) err.age = "Valid age required";
    if (!form.email) err.email = "Email required";
    if (!form.username) err.username = "Username required";
    if (!editing && !form.password) err.password = "Password required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageLoad = (avatar) => {
    setLoadedImages(prev => ({ ...prev, [avatar]: true }));
  };

  const handleImageError = (avatar) => {
    setLoadedImages(prev => ({ ...prev, [avatar]: false }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      const submitData = {
        name: form.name,
        age: Number(form.age),
        email: form.email,
        username: form.username,
        avatar: form.avatar,
        ...(form.password && { password: form.password }),
        ...(!editing && { 
          parent_id: JSON.parse(localStorage.getItem("user") || "{}").id || 2 
        }),
      };

      await onSave(editing ? { ...form, ...submitData } : submitData);
    } catch (err) {
      console.error("Form submission error:", err);
      setApiError(err.message || "Failed to save child. Please try again.");
    }
  };

  const getAvatarImage = (avatar) => {
    const imageLoaded = loadedImages[avatar];
    
    return (
      <div className="position-relative">
        <Image
          src="/assets/images/add-child-avatar/avatar.png",
          alt="Avatar"
          fluid
          className="mb-1"
          style={{ 
            height: "60px", 
            width: "60px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "2px solid #dee2e6"
          }}
          onLoad={() => handleImageLoad(avatar)}
          onError={() => handleImageError(avatar)}
        />
        {loadedImages[avatar] === false && (
          <div
            className="position-absolute top-0 start-0 bg-secondary text-white d-flex align-items-center justify-content-center rounded-circle"
            style={{
              height: "60px",
              width: "60px",
              fontSize: "20px"
            }}
          >
            {form.name?.charAt(0) || '?'}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="child-form-title"
    >
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title id="child-form-title">
            {form.id ? "Edit Child" : "Add Child"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {apiError && (
            <Alert variant="danger" className="mb-3">
              {apiError}
            </Alert>
          )}

          {/* Avatar Selection */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Select Avatar *</Form.Label>
            <Row>
              {AVAILABLE_AVATARS.map((avatar) => (
                <Col xs={4} sm={4} key={avatar} className="mb-3">
                  <div
                    className={`avatar-option rounded p-2 text-center ${
                      form.avatar === avatar 
                        ? "border-primary border-3 bg-light" 
                        : "border border-secondary"
                    }`}
                    style={{ 
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => setForm({ ...form, avatar })}
                    onMouseEnter={(e) => {
                      if (form.avatar !== avatar) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = '#007bff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (form.avatar !== avatar) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#6c757d';
                      }
                    }}
                  >
                    {getAvatarImage(avatar)}
                    <small className="d-block mt-1 text-capitalize">
                      {avatar.replace('avatar', 'Avatar ')}
                    </small>
                  </div>
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Child Full Name *</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Child's User Name *</Form.Label>
                <Form.Control
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Password {!editing && "*"}</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  isInvalid={!!errors.password}
                  placeholder={editing ? "Leave blank to keep current" : ""}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  isInvalid={!!errors.age}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.age}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : form.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChildFormModal;