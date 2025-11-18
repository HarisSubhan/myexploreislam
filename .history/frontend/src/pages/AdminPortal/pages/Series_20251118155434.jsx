import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Image, Modal, Form } from "react-bootstrap";
import AdminLayout from "../AdminApp";
import axios from "axios";

const Series = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSeries, setNewSeries] = useState({ title: "", description: "", thumbnail: null });
  const [saving, setSaving] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSeriesData, setEditSeriesData] = useState({ id: "", title: "", description: "",age:"" thumbnail_url: "", thumbnail: null });
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");
  const IMAGE_BASE_URL = "http://localhost:5000";

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/80";
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  // Fetch series from backend
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axios.get("/api/series", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeriesList(res.data);
      } catch (error) {
        console.error("Error fetching series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, []);

  // Add new series
  const handleAddSeries = async (e) => {
    e.preventDefault();
    if (!newSeries.title || !newSeries.thumbnail) {
      alert("Title and thumbnail are required");
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("title", newSeries.title);
      formData.append("description", newSeries.description);
      formData.append("thumbnail", newSeries.thumbnail);

      const res = await axios.post("/api/series", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSeriesList((prev) => [res.data, ...prev]);
      setShowAddModal(false);
      setNewSeries({ title: "", description: "", thumbnail: null });
    } catch (error) {
      console.error("Error adding series:", error);
      alert("Failed to add series");
    } finally {
      setSaving(false);
    }
  };

  // Delete series
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this series?")) return;
    try {
      await axios.delete(`/api/series/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeriesList((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting series:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (series) => {
    setEditSeriesData({
      id: series.id,
      title: series.title,
      description: series.description,
      age:series.age,
      thumbnail_url: series.thumbnail_url,
      thumbnail: null,
    });
    setShowEditModal(true);
  };

  // Update series
  const handleUpdateSeries = async (e) => {
    e.preventDefault();
    if (!editSeriesData.title) {
      alert("Title is required");
      return;
    }
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("title", editSeriesData.title);
      formData.append("description", editSeriesData.description);
      formData.append("age", editSeriesData.age);
      formData.append("thumbnail_url", editSeriesData.thumbnail_url); // old image path
      if (editSeriesData.thumbnail) {
        formData.append("thumbnail", editSeriesData.thumbnail); // new image
      }

      const res = await axios.put(`/api/series/${editSeriesData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local table
      setSeriesList((prev) =>
        prev.map((s) => (s.id === editSeriesData.id ? { ...s, ...res.data } : s))
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating series:", error);
      alert("Failed to update series");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manage Series</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Series
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table bordered striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Thumbnail</th>
                <th>Age</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {seriesList.length > 0 ? (
                seriesList.map((series, index) => (
                  <tr key={series.id}>
                    <td>{index + 1}</td>
                    <td>{series.title}</td>
                    <td>
                      <Image
                        src={getImageUrl(series.thumbnail_url)}
                        alt={series.title}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                      />
                    </td>
                    <td>{new Date(series.created_at).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditClick(series)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(series.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No series found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Add Series Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Series</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddSeries}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter series title"
                  value={newSeries.title}
                  onChange={(e) =>
                    setNewSeries({ ...newSeries, title: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={newSeries.description}
                  onChange={(e) =>
                    setNewSeries({ ...newSeries, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewSeries({ ...newSeries, thumbnail: e.target.files[0] })
                  }
                  required
                />
              </Form.Group>

              <div className="text-end">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving..." : "Add Series"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Series Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Series</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSeries}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editSeriesData.title}
                  onChange={(e) =>
                    setEditSeriesData({ ...editSeriesData, title: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editSeriesData.description}
                  onChange={(e) =>
                    setEditSeriesData({ ...editSeriesData, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current Thumbnail</Form.Label>
                <div className="mb-2">
                  <Image
                    src={getImageUrl(editSeriesData.thumbnail_url)}
                    alt="Current Thumbnail"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", border: "1px solid #ddd" }}
                  />
                </div>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditSeriesData({ ...editSeriesData, thumbnail: e.target.files[0] })
                  }
                />
              </Form.Group>

              <div className="text-end">
                <Button type="submit" variant="primary" disabled={updating}>
                  {updating ? "Updating..." : "Update Series"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Series;
