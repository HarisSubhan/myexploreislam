import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import axios from "axios";


const ManageChildren = () => {

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    axios
      .get("/api/admin/children", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // use your token logic
        },
      })
      .then((res) => {
        setChildren(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching children:", err);
        setLoading(false);
      });
  }, []);

  const handleView = (child) => {
    setSelectedChild(child);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedChild(null);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this parent?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(`/api/admin/child_soft_delete/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally remove from UI
      setChildren(children.filter((children) => children.id !== id));

    } catch (error) {
      console.error("Error deleting children:", error);
      alert("Failed to delete children.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">Manage Children</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Parent Name</th>
              <th>status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child, index) => (
              <tr key={child.id}>
                <td>{index + 1}</td>
                <td>{child.name}</td>
                <td>{child.email}</td>
                <td>{child.parent_name}</td>
                <td>
                  {child.is_active == 1 ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">In Active</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(child)}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(child.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Child Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedChild && (
              <div>
                <p>
                  <strong>Name:</strong> {selectedChild.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedChild.email}
                </p>
                <p>
                  <strong>Parent Name:</strong> {selectedChild.parent_name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedChild.is_active === 1 ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <h2>Request Child</h2>
        
      </div>
    </AdminLayout>
  );
};

export default ManageChildren;
