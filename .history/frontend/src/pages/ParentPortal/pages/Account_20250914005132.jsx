import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FaUser, FaLock, FaPalette } from "react-icons/fa";

const Account = () => {
  const [active, setActive] = useState("profile");

  return (
    <div className="d-flex flex-column flex-md-row p-4 gap-4">
      {/* Sidebar */}
      <div className="settings-sidebar d-flex flex-md-column gap-3">
        <Button
          variant={active === "profile" ? "primary" : "outline-secondary"}
          className="d-flex align-items-center gap-2"
          onClick={() => setActive("profile")}
        >
          <FaUser /> Profile
        </Button>
        <Button
          variant={active === "password" ? "primary" : "outline-secondary"}
          className="d-flex align-items-center gap-2"
          onClick={() => setActive("password")}
        >
          <FaLock /> Password
        </Button>
        <Button
          variant={active === "theme" ? "primary" : "outline-secondary"}
          className="d-flex align-items-center gap-2"
          onClick={() => setActive("theme")}
        >
          <FaPalette /> Theme
        </Button>
      </div>

      {/* Content */}
      <div className="flex-grow-1">
        {active === "profile" && (
          <Card className="p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3">Edit Profile</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Button variant="success">Save Changes</Button>
            </Form>
          </Card>
        )}

        {active === "password" && (
          <Card className="p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3">Change Password</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="password" />
              </Form.Group>
              <Button variant="warning">Update Password</Button>
            </Form>
          </Card>
        )}

        {active === "theme" && (
          <Card className="p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3">Theme Preferences</h5>
            <Form>
              <Form.Check
                type="radio"
                label="Light Mode"
                name="theme"
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Dark Mode"
                name="theme"
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="System Default"
                name="theme"
                className="mb-2"
              />
              <Button variant="info">Apply Theme</Button>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Account;
