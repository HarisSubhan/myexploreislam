// components/ChildFormModal.js (Simplified Version)
import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Alert, Button } from "react-bootstrap";
import { FaChild, FaUser, FaUserCircle, FaUserAlt, FaSmile, FaBaby } from "react-icons/fa";

const AVAILABLE_AVATARS = [
  { id: "avatar1", icon: <FaChild size={30} />, color: "#007bff", label: "Child 1" },
  { id: "avatar2", icon: <FaUser size={30} />, color: "#28a745", label: "Child 2" },
  { id: "avatar3", icon: <FaUserCircle size={30} />, color: "#dc3545", label: "Child 3" },
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
      setApiError(err.message || "Failed to save child.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{form.id ? "Edit Child" : "Add Child"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {apiError && <Alert variant="danger">{apiError}</Alert>}

          {/* Simple Avatar Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Select Avatar *</Form.Label>
            <Row>
              {AVAILABLE_AVATARS.map((avatar) => (
                <Col xs={4} key={avatar.id} className="mb-2">
                  <div
                    className={`text-center p-2 border rounded ${
                      form.avatar === avatar.id ? "border-primary border-3" : "border-secondary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setForm({ ...form, avatar: avatar.id })}
                  >
                    <div 
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: "50px", 
                        height: "50px", 
                        backgroundColor: avatar.color,
                        color: "white"
                      }}
                    >
                      {avatar.icon}
                    </div>
                    <small className="d-block mt-1">{avatar.label}</small>
                  </div>
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  isInvalid={!!errors.name}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  isInvalid={!!errors.username}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  isInvalid={!!errors.email}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Password {!editing && "*"}</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  isInvalid={!!errors.password}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  isInvalid={!!errors.age}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : form.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChildFormModal;