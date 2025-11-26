import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Image, Modal, Form } from "react-bootstrap";
import AdminLayout from "../AdminApp";
import axios from "axios";

const Series = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [seriesData, setSeriesData] = useState({ 
    id: "", 
    title: "", 
    description: "", 
    age: "", 
    thumbnail_url: "", 
    thumbnail: null 
  });
  const [saving, setSaving] = useState(false);
  const [updatingAges, setUpdatingAges] = useState({}); // Track which ages are being updated

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

  // Handle form submission for both add and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seriesData.title || (modalType === "add" && !seriesData.thumbnail)) {
      alert("Title and thumbnail are required");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("title", seriesData.title);
      formData.append("description", seriesData.description);
      formData.append("age", seriesData.age);

      if (seriesData.thumbnail) {
        formData.append("thumbnail", seriesData.thumbnail);
      } else if (modalType === "edit") {
        formData.append("thumbnail_url", seriesData.thumbnail_url);
      }

      let res;
      if (modalType === "add") {
        res = await axios.post("/api/series", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSeriesList(prev => [res.data, ...prev]);
      } else {
        res = await axios.put(`/api/series/${seriesData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSeriesList(prev => prev.map(s => s.id === seriesData.id ? { ...s, ...res.data } : s));
      }

      handleCloseModal();
    } catch (error) {
      console.error(`Error ${modalType === "add" ? "adding" : "updating"} series:`, error);
      alert(`Failed to ${modalType === "add" ? "add" : "update"} series`);
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
      setSeriesList(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting series:", error);
      alert("Failed to delete series");
    }
  };

  // Open modal for add or edit
  const handleOpenModal = (type, series = null) => {
    setModalType(type);
    if (type === "edit" && series) {
      setSeriesData({
        id: series.id,
        title: series.title || "",
        description: series.description || "",
        age: series.age || "",
        thumbnail_url: series.thumbnail_url || "",
        thumbnail: null,
      });
    } else {
      setSeriesData({ 
        id: "", 
        title: "", 
        description: "", 
        age: "", 
        thumbnail_url: "", 
        thumbnail: null 
      });
    }
    setShowModal(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setSeriesData({ 
      id: "", 
      title: "", 
      description: "", 
      age: "", 
      thumbnail_url: "", 
      thumbnail: null 
    });
  };

  // Handle age input change with debouncing
  const handleAgeChange = (id, newAge) => {
    // Update local state immediately for better UX
    setSeriesList(prev => prev.map(s => 
      s.id === id ? { ...s, age: newAge } : s
    ));

    // Set updating state for this specific series
    setUpdatingAges(prev => ({ ...prev, [id]: true }));

    // Debounce the API call
    setTimeout(async () => {
      try {
        await axios.put(`/api/series/${id}`, 
          { age: newAge },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Age updated for series ${id}: ${newAge}`);
      } catch (error) {
        console.error("Error updating age:", error);
        // Revert local state on error
        setSeriesList(prev => prev.map(s => 
          s.id === id ? { ...s, age: seriesList.find(item => item.id === id)?.age || "" } : s
        ));
        alert("Failed to update age");
      } finally {
        setUpdatingAges(prev => ({ ...prev, [id]: false }));
      }
    }, 1000); // 1 second debounce
  };

  // Quick age update with enter key
  const handleAgeKeyPress = (e, id, currentAge) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Remove focus to trigger the update
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manage Series</h2>
          <Button variant="primary" onClick={() => handleOpenModal("add")}>
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
                <th>Description</th>
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
                    <td>
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          value={series.age || ""}
                          onChange={(e) => handleAgeChange(series.id, e.target.value)}
                          onKeyPress={(e) => handleAgeKeyPress(e, series.id, series.age)}
                          className="form-control form-control-sm"
                          placeholder="e.g., 3-5"
                          style={{ width: "80px" }}
                          disabled={updatingAges[series.id]}
                        />
                        {updatingAges[series.id] && (
                          <Spinner animation="border" size="sm" className="ms-2" />
                        )}
                      </div>
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
                        "No description"
                      )}
                    </td>
                    <td>{new Date(series.created_at).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpenModal("edit", series)}
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
                  <td colSpan="7" className="text-center text-muted">
                    No series found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Unified Modal for Add/Edit */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "add" ? "Add New Series" : "Edit Series"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter series title"
                  value={seriesData.title}
                  onChange={(e) => setSeriesData({ ...seriesData, title: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={seriesData.description}
                  onChange={(e) => setSeriesData({ ...seriesData, description: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 3-5, 6-8, 9-12"
                  value={seriesData.age}
                  onChange={(e) => setSeriesData({ ...seriesData, age: e.target.value })}
                />
                <Form.Text className="text-muted">
                  You can also update age directly in the table
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Thumbnail {modalType === "add" ? "*" : ""}
                </Form.Label>
                
                {modalType === "edit" && seriesData.thumbnail_url && (
                  <div className="mb-2">
                    <Form.Label>Current Thumbnail:</Form.Label>
                    <div>
                      <Image
                        src={getImageUrl(seriesData.thumbnail_url)}
                        alt="Current Thumbnail"
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", border: "1px solid #ddd" }}
                      />
                    </div>
                  </div>
                )}
                
                <Form.Label>
                  {modalType === "edit" ? "Upload New Thumbnail (optional):" : "Select Thumbnail:"}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSeriesData({ ...seriesData, thumbnail: e.target.files[0] })}
                  required={modalType === "add"}
                />
                
                {modalType === "edit" && (
                  <Form.Text className="text-muted">
                    Leave empty to keep current thumbnail
                  </Form.Text>
                )}
              </Form.Group>

              <div className="text-end">
                <Button 
                  variant="secondary" 
                  className="me-2" 
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving 
                    ? (modalType === "add" ? "Saving..." : "Updating...") 
                    : (modalType === "add" ? "Add Series" : "Update Series")
                  }
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