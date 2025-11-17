import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FaUser, FaLock, FaPalette } from "react-icons/fa";

const Account = () => {
  const [activeSection, setActiveSection] = useState("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Button variant="primary">Save Profile</Button>
          </Form>
        );
      case "password":
        return (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter current password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" />
            </Form.Group>
            <Button variant="warning">Update Password</Button>
          </Form>
        );
      case "theme":
        return (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Theme</Form.Label>
              <Form.Select>
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </Form.Select>
            </Form.Group>
            <Button variant="success">Apply Theme</Button>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex gap-4 p-4">
      {/* Sidebar Options */}
      <div className="d-flex flex-column gap-3" style={{ width: "250px" }}>
        <Card
          className={`p-3 shadow-sm ${
            activeSection === "profile" ? "border-primary" : ""
          }`}
          onClick={() => setActiveSection("profile")}
          style={{ cursor: "pointer", transition: "0.3s" }}
        >
          <FaUser size={24} className="mb-2 text-primary" />
          <h6 className="mb-0">Profile</h6>
        </Card>
        <Card
          className={`p-3 shadow-sm ${
            activeSection === "password" ? "border-warning" : ""
          }`}
          onClick={() => setActiveSection("password")}
          style={{ cursor: "pointer", transition: "0.3s" }}
        >
          <FaLock size={24} className="mb-2 text-warning" />
          <h6 className="mb-0">Password</h6>
        </Card>
        <Card
          className={`p-3 shadow-sm ${
            activeSection === "theme" ? "border-success" : ""
          }`}
          onClick={() => setActiveSection("theme")}
          style={{ cursor: "pointer", transition: "0.3s" }}
        >
          <FaPalette size={24} className="mb-2 text-success" />
          <h6 className="mb-0">Theme</h6>
        </Card>
      </div>

      {/* Main Section */}
      <Card className="flex-grow-1 p-4 shadow-sm">
        <h4 className="mb-4 text-capitalize">{activeSection} Settings</h4>
        {renderSection()}
      </Card>
    </div>
  );
};

export default Account;
