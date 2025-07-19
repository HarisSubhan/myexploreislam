import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../AdminApp";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all subscriptions
  useEffect(() => {
    axios
      .get("/api/subscriptions/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("✅ Subscription API Response:", res.data);
        setSubscriptions([res.data]); // Expecting an array
      })
      .catch((err) => {
        console.error("❌ Failed to fetch subscriptions", err);
      })
      .finally(() => {
        setLoading(false); // Always stop loading
      });
  }, []);

  // Cancel a subscription
  const handleCancel = (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this subscription?");
    if (!confirmCancel) return;

    axios
      .delete(`/api/subscriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      })
      .catch((err) => {
        console.error("❌ Failed to cancel subscription", err);
      });
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">💳 Manage Subscriptions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
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
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No subscriptions found.</td>
                </tr>
              ) : (
                subscriptions.map((sub, index) => (
                  <tr key={sub.id}>
                    <td>{index + 1}</td>
                    <td>{sub.parent_name || "N/A"}</td>
                    <td>{sub.plan_name}</td>
                    <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                    <td>{new Date(sub.end_date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${sub.is_active === 1 ? "bg-success" : "bg-secondary"}`}
                      >
                        {sub.is_active === 1 ? "Active" : "Deactive"}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/manage-subscriptions/edit/${sub.id}`}>
                        <Button variant="warning" size="sm" className="me-2">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(sub.id)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageSubscriptions;
