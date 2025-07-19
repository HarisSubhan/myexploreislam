import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { uploadAssignment } from "../.."; I

const AddAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [video, setVideo] = useState("");
  const [dueDate, setDueDate] = useState("");

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
    formData.append("category", category);
    formData.append("video", video);
    formData.append("dueDate", dueDate);

    const token = localStorage.getItem("token");

    try {
      const result = await uploadAssignment(formData, token);
      alert(result.message || "Assignment uploaded successfully!");

      // Reset fields
      setTitle("");
      setDescription("");
      setFile(null);
      setCategory("");
      setVideo("");
      setDueDate("");
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

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
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
