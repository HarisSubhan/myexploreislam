import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal, Form, Image } from "react-bootstrap";
import AdminLayout from "../AdminApp";
import axios from "axios";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", imageFile: null });
  const [saving, setSaving] = useState(false);

  const IMAGE_BASE_URL = "http://localhost:5000";

  const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/80";
  if (path.startsWith("http")) return path; // already full URL
  return `${IMAGE_BASE_URL}${path}`; // /uploads/123.png => http://localhost:5000/uploads/123.png
};

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModuleData, setEditModuleData] = useState({
    id: "",
    name: "",
    thumbnail_url: "",
    imageFile: null,
  });
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch modules
  const fetchModules = async () => {
    try {
      const res = await axios.get("/api/modules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(res.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add module
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModule.name || !newModule.imageFile) {
      alert("Please fill all fields and select an image");
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", newModule.name);
      formData.append("thumbnail", newModule.imageFile);
      await axios.post("/api/modules", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowAddModal(false);
      setNewModule({ name: "", imageFile: null });
      fetchModules();
    } catch (error) {
      console.error("Error adding module:", error);
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal with existing data
  const handleEditClick = (module) => {
    setEditModuleData({
      id: module.id,
      name: module.name,
      thumbnail_url: module.thumbnail_url,
      imageFile: null,
    });
    setShowEditModal(true);
  };

  // Update module API call
  const handleUpdateModule = async (e) => {
    e.preventDefault();
    if (!editModuleData.name) {
      alert("Module name is required");
      return;
    }
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", editModuleData.name);
      formData.append("thumbnail_url", editModuleData.thumbnail_url); // old image path
      if (editModuleData.imageFile) {
        formData.append("thumbnail", editModuleData.imageFile); // new image file
      }
      await axios.put(`/api/modules/${editModuleData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowEditModal(false);
      fetchModules();
    } catch (error) {
      console.error("Error updating module:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Delete module
  const deleteModule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await axios.delete(`/api/modules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules((prev) => prev.filter((mod) => mod.id !== id));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `/api/modules/${id}/toggle`,
        { is_active: currentStatus ? 0 : 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchModules();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };


  const softDeleteModule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await axios.delete(`/api/modules/${id}/soft`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules((prev) => prev.filter((mod) => mod.id !== id));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };


  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manage Modules</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Module
          </Button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table bordered striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {modules.length > 0 ? (
                modules.map((mod, index) => (
                  <tr key={mod.id}>
                    <td>{index + 1}</td>
                    <td>{mod.name || "No Name"}</td>
                    <td>
                      <img
                        src={getImageUrl(mod.thumbnail_url) || "https://via.placeholder.com/80"}
                        alt={mod.name || "Module"}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditClick(mod)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={mod.is_active ? "secondary" : "success"}
                        size="sm"
                        className="me-2"
                        onClick={() => toggleStatus(mod.id, mod.is_active)}
                      >
                        {mod.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => softDeleteModule(mod.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Add Module Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Module</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddModule}>
              <Form.Group className="mb-3">
                <Form.Label>Module Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter module name"
                  value={newModule.name}
                  onChange={(e) =>
                    setNewModule({ ...newModule, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Thumbnail</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setNewModule({ ...newModule, imageFile: e.target.files[0] })
                  }
                />
              </Form.Group>
              <div className="text-end">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving..." : "Add Module"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Module Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Module</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateModule}>
              <Form.Group className="mb-3">
                <Form.Label>Module Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editModuleData.name}
                  onChange={(e) =>
                    setEditModuleData({ ...editModuleData, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Current Thumbnail</Form.Label>
                <div className="mb-2">
                  <Image
                    src={getImageUrl(editModuleData.thumbnail_url) || "https://via.placeholder.com/80"}
                    alt="Current Thumbnail"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setEditModuleData({
                      ...editModuleData,
                      imageFile: e.target.files[0],
                    })
                  }
                />
              </Form.Group>
              <div className="text-end">
                <Button type="submit" variant="primary" disabled={updating}>
                  {updating ? "Updating..." : "Update Module"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Modules;
