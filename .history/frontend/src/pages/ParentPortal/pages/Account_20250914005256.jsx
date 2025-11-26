import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FaUser, FaLock, FaPalette } from "react-icons/fa";

const Account = () => {
  const [active, setActive] = useState("profile");

  const menuItems = [
    { key: "profile", label: "Profile", icon: <FaUser /> },
    { key: "password", label: "Password", icon: <FaLock /> },
    { key: "theme", label: "Theme", icon: <FaPalette /> },
  ];

  return (
    <div className="d-flex flex-column flex-md-row p-4 gap-4">
      {/* Sidebar Navigation */}
      <div className="settings-sidebar p-3 rounded shadow-sm bg-white">
        <h6 className="fw-bold text-muted mb-3">Account Settings</h6>
        <div className="d-flex flex-md-column flex-row gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.key}
              variant={active === item.key ? "primary" : "outline-light"}
              className={`d-flex align-items-center gap-2 text-start w-100 ${
                active === item.key ? "shadow-sm" : "border"
              }`}
              onClick={() => setActive(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {active === "profile" && (
          <Card className="p-4 shadow-sm border-0 rounded-4">
            <h4 className="fw-bold mb-4">👤 Edit Profile</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  className="rounded-pill"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-pill"
                />
              </Form.Group>
              <Button variant="success" className="rounded-pill px-4">
                Save Changes
              </Button>
            </Form>
          </Card>
        )}

        {active === "password" && (
          <Card className="p-4 shadow-sm border-0 rounded-4">
            <h4 className="fw-bold mb-4">🔒 Change Password</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Current Password
                </Form.Label>
                <Form.Control type="password" className="rounded-pill" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">New Password</Form.Label>
                <Form.Control type="password" className="rounded-pill" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Confirm New Password
                </Form.Label>
                <Form.Control type="password" className="rounded-pill" />
              </Form.Group>
              <Button variant="warning" className="rounded-pill px-4">
                Update Password
              </Button>
            </Form>
          </Card>
        )}

        {active === "theme" && (
          <Card className="p-4 shadow-sm border-0 rounded-4">
            <h4 className="fw-bold mb-4">🎨 Theme Preferences</h4>
            <Form>
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  label="Light Mode"
                  name="theme"
                  className="fw-semibold"
                />
                <Form.Check
                  type="radio"
                  label="Dark Mode"
                  name="theme"
                  className="fw-semibold"
                />
                <Form.Check
                  type="radio"
                  label="System Default"
                  name="theme"
                  className="fw-semibold"
                />
              </div>
              <Button variant="info" className="mt-3 rounded-pill px-4">
                Apply Theme
              </Button>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Account;
