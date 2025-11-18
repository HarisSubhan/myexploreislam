import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Image, Modal, Form, Alert } from "react-bootstrap";
import AdminLayout from "../AdminApp";
import axios from "axios";

const Series = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSeries, setNewSeries] = useState({ 
    title: "", 
    description: "", 
    age: "",
    thumbnail: null 
  });
  const [saving, setSaving] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSeriesData, setEditSeriesData] = useState({ 
    id: "", 
    title: "", 
    description: "", 
    age: "", 
    thumbnail_url: "", 
    thumbnail: null 
  });
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");
  const IMAGE_BASE_URL = "http://localhost:5000";

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/80";
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  // Fetch series from backend
  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/api/series", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched series:", res.data);
      setSeriesList(res.data);
    } catch (error) {
      console.error("Error fetching series:", error);
      setError("Failed to load series");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  // Add new series
  const handleAddSeries = async (e) => {
    e.preventDefault();
    if (!newSeries.title || !newSeries.thumbnail) {
      setError("Title and thumbnail are required");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const formData = new FormData();
      formData.append("title", newSeries.title);
      formData.append("description", newSeries.description);
      formData.append("age", newSeries.age);
      formData.append("thumbnail", newSeries.thumbnail);

      const res = await axios.post("/api/series", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update state immediately
      setSeriesList((prev) => [res.data, ...prev]);
      setShowAddModal(false);
      setNewSeries({ 
        title: "", 
        description: "", 
        age: "", 
        thumbnail: null 
      });
      setSuccess("Series added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding series:", error);
      setError("Failed to add series: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Delete series
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this series?")) return;
    try {
      setError("");
      await axios.delete(`/api/series/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update state immediately
      setSeriesList((prev) => prev.filter((s) => s.id !== id));
      setSuccess("Series deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting series:", error);
      setError("Failed to delete series: " + (error.response?.data?.message || error.message));
    }
  };

  // Open edit modal
  const handleEditClick = (series) => {
    console.log("Editing series:", series);
    setEditSeriesData({
      id: series.id,
      title: series.title || "",
      description: series.description || "",
      age: series.age || "",
      thumbnail_url: series.thumbnail_url || "",
      thumbnail: null,
    });
    setShowEditModal(true);
    setError("");
  };

  // Update series
  const handleUpdateSeries = async (e) => {
    e.preventDefault();
    if (!editSeriesData.title) {
      setError("Title is required");
      return;
    }
    try {
      setUpdating(true);
      setError("");
      const formData = new FormData();
      formData.append("title", editSeriesData.title);
      formData.append("description", editSeriesData.description);
      formData.append("age", editSeriesData.age);
      
      // Handle thumbnail - send new one if provided, otherwise keep current
      if (editSeriesData.thumbnail) {
        formData.append("thumbnail", editSeriesData.thumbnail);
      } else {
        formData.append("thumbnail_url", editSeriesData.thumbnail_url);
      }

      console.log("Updating series with data:", {
        title: editSeriesData.title,
        description: editSeriesData.description,
        age: editSeriesData.age,
        hasNewThumbnail: !!editSeriesData.thumbnail
      });

      const res = await axios.put(`/api/series/${editSeriesData.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update response:", res.data);

      // Update state immediately with the response data
      setSeriesList((prev) =>
        prev.map((s) => 
          s.id === editSeriesData.id 
            ? { ...s, ...res.data, updated_at: new Date().toISOString() }
            : s
        )
      );

      setShowEditModal(false);
      setEditSeriesData({ 
        id: "", 
        title: "", 
        description: "", 
        age: "", 
        thumbnail_url: "", 
        thumbnail: null 
      });
      setSuccess("Series updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating series:", error.response?.data || error.message);
      setError("Failed to update series: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // Refresh series list
  const handleRefresh = () => {
    fetchSeries();
    setSuccess("Series list refreshed!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Clear alerts
  const clearAlerts = () => {
    setError("");
    setSuccess("");
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manage Series</h2>
          <div>
            <Button 
              variant="outline-secondary" 
              className="me-2" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </Button>
            <Button variant="primary" onClick={() => { setShowAddModal(true); clearAlerts(); }}>
              Add Series
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading series...</p>
          </div>
        ) : (
          <Table bordered striped hover responsive>
            <thead className="bg-light">
              <tr>
                <th width="50">#</th>
                <th>Title</th>
                <th width="100">Thumbnail</th>
                <th width="80">Age</th>
                <th>Description</th>
                <th width="180">Created At</th>
                <th width="150" className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {seriesList.length > 0 ? (
                seriesList.map((series, index) => (
                  <tr key={series.id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{series.title}</strong>
                    </td>
                    <td>
                      <Image
                        src={getImageUrl(series.thumbnail_url)}
                        alt={series.title}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                        className="border"
                      />
                    </td>
                    <td>
                      <span className="badge bg-primary">{series.age || "N/A"}</span>
                    </td>
                    <td>
                      {series.description ? (
                        <span title={series.description}>
                          {series.description.length > 50 
                            ? `${series.description.substring(0, 50)}...` 
                            : series.description
                          }
                        </span>
                      ) : (
                        <span className="text-muted">No description</span>
                      )}
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(series.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditClick(series)}
                        title="Edit series"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(series.id)}
                        title="Delete series"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    <i className="bi bi-inbox display-4 d-block mb-2"></i>
                    No series found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Add Series Modal */}
        <Modal show={showAddModal} onHide={() => { setShowAddModal(false); clearAlerts(); }}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Series</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddSeries}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
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
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 3-5, 6-8, 9-12"
                  value={newSeries.age}
                  onChange={(e) =>
                    setNewSeries({ ...newSeries, age: e.target.value })
                  }
                />
                <Form.Text className="text-muted">
                  Enter age range like "3-5" or specific age like "5+"
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail *</Form.Label>
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
                <Button 
                  variant="secondary" 
                  className="me-2" 
                  onClick={() => setShowAddModal(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    "Add Series"
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Series Modal */}
        <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearAlerts(); }}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Series</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSeries}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
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
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 3-5, 6-8, 9-12"
                  value={editSeriesData.age}
                  onChange={(e) =>
                    setEditSeriesData({ ...editSeriesData, age: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail</Form.Label>
                {editSeriesData.thumbnail_url && (
                  <div className="mb-2">
                    <Form.Label className="text-muted">Current Thumbnail:</Form.Label>
                    <div>
                      <Image
                        src={getImageUrl(editSeriesData.thumbnail_url)}
                        alt="Current Thumbnail"
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", border: "1px solid #ddd", borderRadius: "4px" }}
                      />
                    </div>
                  </div>
                )}
                <Form.Label className="text-muted">Upload New Thumbnail (optional):</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditSeriesData({ ...editSeriesData, thumbnail: e.target.files[0] })
                  }
                />
                <Form.Text className="text-muted">
                  Leave empty to keep current thumbnail
                </Form.Text>
              </Form.Group>

              <div className="text-end">
                <Button 
                  variant="secondary" 
                  className="me-2" 
                  onClick={() => setShowEditModal(false)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={updating}>
                  {updating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Series"
                  )}
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