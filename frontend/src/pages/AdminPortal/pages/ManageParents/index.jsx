import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import axios from 'axios';

const ManageParents = () => {
  const [parents, setParents] = useState([]);

  const [selectedParent, setSelectedParent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const token = localStorage.getItem('token'); // 🔐 Adjust based on your auth method
        const res = await axios.get('/api/admin/parents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParents(res.data);
      } catch (error) {
        console.error("Error fetching parents:", error);
      }
    };

    fetchParents();
  }, []);

  const handleView = (parent) => {
    setSelectedParent(parent);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this parent?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(`/api/admin/parent_soft_delete/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally remove from UI
      setParents(parents.filter((parent) => parent.id !== id));

    } catch (error) {
      console.error("Error deleting parent:", error);
      alert("Failed to delete parent.");
    }
  };


  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">Manage Parents</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent, index) => (
              <tr key={parent.id}>
                <td>{index + 1}</td>
                <td>{parent.name}</td>
                <td>{parent.email}</td>
                <td>{(parent.phone_number) ? parent.phone_number : "NA"}</td>
                <td>
                  {parent.is_active == 1 ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">In Active</span>
                  )}
                </td>

                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleView(parent)}>
                    View
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(parent.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* View Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Parent Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedParent && (
              <div>
                <p><strong>Name:</strong> {selectedParent.name}</p>
                <p><strong>Email:</strong> {selectedParent.email}</p>
                <p><strong>Phone:</strong> {(selectedParent.phone_number) ? selectedParent.phone_number : "NA"}</p>
                <p><strong>Status:</strong> {selectedParent.is_active == 1 ? (<span className="badge bg-success">Active</span>) : (<span className="badge bg-danger">In Active</span>)}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageParents;
