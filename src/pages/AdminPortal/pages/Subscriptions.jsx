import React from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../AdminApp";

const dummySubscriptions = [
  {
    id: 1,
    parentName: "Ahmed Khan",
    plan: "Monthly",
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    status: "Active",
  },
  {
    id: 2,
    parentName: "Sara Ali",
    plan: "Annual",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "Active",
  },
  {
    id: 3,
    parentName: "Usman Farooq",
    plan: "Monthly",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    status: "Expired",
  },
];

const ManageSubscriptions = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">💳 Manage Subscriptions</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Parent Name</th>
              <th>Plan</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummySubscriptions.map((sub, index) => (
              <tr key={sub.id}>
                <td>{index + 1}</td>
                <td>{sub.parentName}</td>
                <td>{sub.plan}</td>
                <td>{sub.startDate}</td>
                <td>{sub.endDate}</td>
                <td>
                  <span
                    className={`badge ${
                      sub.status === "Active" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">Cancel</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ManageSubscriptions;
