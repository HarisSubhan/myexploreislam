import React, { useState } from "react";
import { Button, Form, FloatingLabel } from "react-bootstrap";

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FloatingLabel controlId="fullName" label="Full Name" className="mb-3">
        <Form.Control
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="email" label="Email" className="mb-3">
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="username" label="Username" className="mb-3">
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="password" label="Password" className="mb-3">
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-3">
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <Button
        type="submit"
        disabled={loading}
        className="w-100"
        style={{ backgroundColor: '#f1066c' }}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
};

export default RegisterForm;
