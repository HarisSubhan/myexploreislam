import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import AccountDetailsTable from "../../../components/parent/AccountDetailsTable";

const Account = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Account Settings</h2>
      <Tabs defaultActiveKey="profile" id="account-tabs" className="mb-3">
        <Tab eventKey="profile" title="Profile">
          <AccountDetailsTable />
        </Tab>
        <Tab eventKey="password" title="Password">
          <div>
            <h5>Change Password</h5>
            <form style={{ maxWidth: "400px" }}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </form>
          </div>
        </Tab>
        <Tab eventKey="theme" title="Theme">
          <div>
            <h5>Select Theme</h5>
            <button className="btn btn-dark me-2">Dark Mode</button>
            <button className="btn btn-light">Light Mode</button>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Account;
