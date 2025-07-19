import React, { useEffect, useState } from "react";
import { Form, Button, Card, Spinner, ListGroup } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { uploadAssignment } from "../../../../services/assignmentApi";
import { getCategoriesApi } from "../../../../services/categoryApi";

const AddAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getCategoriesApi();
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("video", video);
    formData.append("dueDate", dueDate);
    formData.append("categories", JSON.stringify(selectedCategories));

    const token = localStorage.getItem("token");

    try {
      const result = await uploadAssignment(formData, token);
      alert(result.message || "Assignment uploaded successfully!");

      // Reset fields
      setTitle("");
      setDescription("");
      setFile(null);
      setVideo("");
      setDueDate("");
      setSelectedCategories([]);
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed: " + error.message);
    }
  };

  return (
    <AdminLayout>
      <Card className="m-4 p-4">
        <h2 className="mb-4">📚 Add Assignment</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="file" className="mb-3">
            <Form.Label>Upload File</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Select Categories</Form.Label>
            <Card>
              <Card.Body style={{ maxHeight: "200px", overflowY: "auto" }}>
                {loading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : categories.length > 0 ? (
                  <ListGroup variant="flush">
                    {categories.map((category) => (
                      <ListGroup.Item
                        key={category.id}
                        className="px-0 py-2"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`category-${category.id}`}
                          label={category.name}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-muted">No categories available</div>
                )}
              </Card.Body>
            </Card>
            <Form.Text className="text-muted">
              {selectedCategories.length > 0
                ? `${selectedCategories.length} categories selected`
                : "Select at least one category"}
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="video" className="mb-3">
            <Form.Label>Related Video (Optional)</Form.Label>
            <Form.Control
              type="text"
              value={video}
              onChange={(e) => setVideo(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="dueDate" className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Add Assignment
          </Button>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default AddAssignment;
