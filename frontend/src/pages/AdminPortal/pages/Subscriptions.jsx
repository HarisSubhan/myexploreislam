import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import AdminLayout from "../AdminApp";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    plan_name: "",
    price: "",
    max_children: 2,
    start_date: "",
    end_date: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);


  // Fetch all subscriptions
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subscriptions/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("All Subscriptions:", res.data);
        if (Array.isArray(res.data)) {
          setSubscriptions(res.data);
        } else {
          setSubscriptions([]);
          console.error("Response is not an array", res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch subscriptions", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Cancel subscription
  const handleCancel = (id) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    axios
      .delete(`http://localhost:5000/api/subscriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      })
      .catch((err) => {
        console.error("Failed to cancel subscription", err);
      });
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new subscription
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        // Edit existing subscription
        await axios.put(`http://localhost:5000/api/subscriptions/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setSubscriptions((prev) =>
          prev.map((sub) => (sub.id === editId ? { ...sub, ...formData } : sub))
        );
      } else {
        const response = await axios.post("http://localhost:5000/api/subscriptions/subscribe", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("✅ Added subscription:", response.data);
        setSubscriptions((prev) => [...prev, response.data]); // add to list
        setShowModal(false);
        setFormData({
          plan_name: "",
          price: "",
          max_children: 2,
          start_date: "",
          end_date: "",
        });
      }
    } catch (error) {
      console.error("Failed to add subscription:", error);
    }
  };

  const handleEdit = (subscription) => {
    setFormData({
      plan_name: subscription.plan_name,
      price: subscription.price,
      max_children: subscription.max_children,
      start_date: subscription.start_date?.split("T")[0],
      end_date: subscription.end_date?.split("T")[0],
    });
    setEditId(subscription.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleToggleStatus = (id, currentStatus) => {
    const confirmMsg = currentStatus === 1
      ? "Are you sure you want to deactivate this subscription?"
      : "Are you sure you want to activate this subscription?";

    if (!window.confirm(confirmMsg)) return;

    axios
      .put(`http://localhost:5000/api/subscriptions/${id}/status`, { is_active: currentStatus === 1 ? 0 : 1 }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === id ? { ...sub, is_active: currentStatus === 1 ? 0 : 1 } : sub
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update status", err);
      });
  };


  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-4">Manage Subscriptions</h2>

          {/* Add Button */}
          <Button variant="success" className="mb-3" onClick={() => setShowModal(true)}>
            Add Subscription
          </Button>
        </div>

        {/* Modal Form */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Subscription</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Plan Name</Form.Label>
                <Form.Control
                  type="text"
                  name="plan_name"
                  value={formData.plan_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Max Children</Form.Label>
                <Form.Control
                  type="number"
                  name="max_children"
                  value={formData.max_children}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Subscriptions Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
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
                  <td colSpan="6" className="text-center">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, index) => (
                  <tr key={sub.id}>
                    <td>{index + 1}</td>
                    <td>{sub.plan_name}</td>
                    <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                    <td>{new Date(sub.end_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${sub.is_active === 1 ? "bg-success" : "bg-secondary"}`}>
                        {sub.is_active === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(sub)}>
                        Edit
                      </Button>
                      <Button
                        variant={sub.is_active === 1 ? "secondary" : "success"}
                        size="sm"
                        onClick={() => handleToggleStatus(sub.id, sub.is_active)}
                      >
                        {sub.is_active === 1 ? "Deactivate" : "Activate"}
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