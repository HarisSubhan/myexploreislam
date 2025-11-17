import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { addChild } from "../../services/api";
import toast from "react-hot-toast";

const ChildAdd = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { color: themeColor, textColor } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.username) {
      newErrors.username = "Child User Name is required";
    }
    if (!formData.name) {
      newErrors.name = "Child Name is required";
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
    setErrors({});

    try {
      const res = await addChild(formData);

      // ✅ Success toast
      toast.success(res.message || "Child account created!");

      // Reset form
      setFormData({ email: "", username: "", name: "", password: "" });
    } catch (error) {
     
      const errMsg =
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Something went wrong";

      toast.error(errMsg);
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
              <Form onSubmit={handleSubmit}>
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

                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Child's User Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                    placeholder="Enter child's User name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter Email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Create a password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
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
