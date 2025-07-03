import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import axios from 'axios';

const ManageParents = () => {
  const [parents, setParents] = useState([
    // {
    //   id: 1,
    //   name: "Ahmed Khan",
    //   email: "ahmed@example.com",
    //   phone: "03001234567",
    // },
    // {
    //   id: 2,
    //   name: "Ayesha Fatima",
    //   email: "ayesha@example.com",
    //   phone: "03111234567",
    // },
  ]);

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

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this parent?");
    if (confirmDelete) {
      setParents(parents.filter((parent) => parent.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">👪 Manage Parents</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent, index) => (
              <tr key={parent.id}>
                <td>{index + 1}</td>
                <td>{parent.name}</td>
                <td>{parent.email}</td>
                <td>{parent.phone}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleView(parent)}>
                    👁️ View
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(parent.id)}>
                    🗑️ Delete
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
                <p><strong>Phone:</strong> {selectedParent.phone}</p>
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
