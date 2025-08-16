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

      setSeriesList((prev) => [res.data, ...prev]); // Add new series to top
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

  return (
    <AdminLayout>
      <div className="p-4">
        {/* Header with Add Series Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manage Series</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Series
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
                <th>Title</th>
                <th>Thumbnail</th>
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
                        onClick={() => alert("Edit functionality coming soon")}
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
      </div>
    </AdminLayout>
  );
};

export default Series;
