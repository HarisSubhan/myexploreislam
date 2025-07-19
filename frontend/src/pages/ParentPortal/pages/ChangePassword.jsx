import React, { useState } from 'react';
import { Button, Card, Form, Container, Alert } from 'react-bootstrap';
import { LockFill, Eye, EyeSlash } from 'react-bootstrap-icons';
import { useTheme } from '../../../context/ThemeContext';

const ChangePassword = () => {
  const { color: themeColor, textColor } = useTheme(); 

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Here you would typically make an API call
      console.log('Password change submitted', formData);
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Container className="py-5">
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="text-center mb-4">
              <LockFill size={40} className="text-primary mb-3" />
              <h2 className="h4">Change Password</h2>
              <p className="text-muted">Create a new password for your account</p>
            </div>

            {success && (
              <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                Password changed successfully!
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.currentPassword}
                    placeholder="Enter current password"
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-secondary"
                    onClick={() => toggleShowPassword('current')}
                  >
                    {showPassword.current ? <EyeSlash /> : <Eye />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.newPassword}
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-secondary"
                    onClick={() => toggleShowPassword('new')}
                  >
                    {showPassword.new ? <EyeSlash /> : <Eye />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Confirm new password"
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-secondary"
                    onClick={() => toggleShowPassword('confirm')}
                  >
                    {showPassword.confirm ? <EyeSlash /> : <Eye />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2"
                style={{ backgroundColor: themeColor, color: textColor }}
              >
                Update Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ChangePassword;