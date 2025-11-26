// components/ChildFormModal.js
import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Alert, Button, Image } from "react-bootstrap";

// Import the image directly
import avatar1 from "../../assets/add-child-avatar/avatar1.png";

const AVAILABLE_AVATARS = [
  { id: "avatar1", image: avatar1, label: "Avatar 1" },
  { id: "avatar2", image: avatar1, label: "Avatar 2" },
  { id: "avatar3", image: avatar1, label: "Avatar 3" },
];

const ChildFormModal = ({ show, onHide, onSave, editing, submitting }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    username: "",
    password: "",
    avatar: "avatar1",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (editing) {
      // Editing mode - fill form with existing data
      setForm({
        name: editing.name || "",
        age: editing.age || "",
        email: editing.email || "",
        username: editing.username || "",
        password: "", // Don't pre-fill password for security
        avatar: editing.avatar || "avatar1",
      });
    } else {
      // Add new child mode - reset form
      setForm({
        name: "",
        age: "",
        email: "",
        username: "",
        password: "",
        avatar: "avatar1",
      });
    }
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
      };

      // Add parent_id only for new children
      if (!editing) {
        submitData.parent_id = JSON.parse(localStorage.getItem("user") || "{}").id;
      }

      // Call onSave with appropriate data
      if (editing) {
        // For editing, include the id from editing object
        await onSave({
          ...submitData,
          id: editing.id // Safe access
        });
      } else {
        // For new child, just send submitData
        await onSave(submitData); // No id needed for new child
      }
    } catch (err) {
      setApiError(err.message || "Failed to save child.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Child" : "Add Child"}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {apiError && <Alert variant="danger">{apiError}</Alert>}

          {/* Avatar Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Select Avatar *</Form.Label>
            <Row>
              {AVAILABLE_AVATARS.map((avatar) => (
                <Col xs={4} key={avatar.id}>
                  <div
                    className={`text-center p-2 border rounded ${
                      form.avatar === avatar.id ? "border-primary border-3" : "border-secondary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setForm({ ...form, avatar: avatar.id })}
                  >
                    <Image
                      src={avatar.image}
                      alt={avatar.label}
                      roundedCircle
                      style={{ 
                        width: "60px", 
                        height: "60px", 
                        objectFit: "cover" 
                      }}
                    />
                    <small className="d-block mt-1">{avatar.label}</small>
                  </div>
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password {!editing && "*"}</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  isInvalid={!!errors.password}
                  placeholder={editing ? "Leave blank to keep current password" : "Enter password"}
                  autoComplete="new-password" // Fixed autocomplete warning
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
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
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : editing ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChildFormModal;