import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";

const ChildAdd = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { color: themeColor, textColor } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10-15 digits";
    }

    if (!formData.name) {
      newErrors.name = "Child name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const token = localStorage.getItem("token"); // ✅ Check token in localStorage

      if (!token) {
        setErrors({ form: "You are not logged in. Please log in first." });
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/parent/add-child",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in headers
          },
        }
      );

      setSuccessMessage(response.data.message || "Child account created!");
      setFormData({
        email: "",
        phone: "",
        name: "",
        password: "",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      setErrors({ form: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header as="h5" className="text-center">
              Create Child Account
            </Card.Header>
            <Card.Body>
              {successMessage && (
                <Alert
                  variant="success"
                  onClose={() => setSuccessMessage("")}
                  dismissible
                >
                  {successMessage}
                </Alert>
              )}

              {errors.form && (
                <Alert
                  variant="danger"
                  onClose={() => setErrors({})}
                  dismissible
                >
                  {errors.form}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter child's email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Child's Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter child's full name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Create a password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    At least 8 characters
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    style={{ backgroundColor: themeColor, color: textColor }}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Child"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChildAdd;
