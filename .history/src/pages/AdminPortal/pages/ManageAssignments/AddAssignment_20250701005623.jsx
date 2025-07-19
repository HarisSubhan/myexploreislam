import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import AdminLayout from "../../AdminApp";

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

    try {
      const token = localStorage.getItem("token"); // or from context/auth state

      const response = await fetch("http://localhost:5000/api/assignments/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Assignment uploaded successfully!");
        setTitle("");
        setDescription("");
        setFile(null);
        setCategory("");
        setVideo("");
        setDueDate("");
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading.");
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
              placeholder="Enter assignment title"
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
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="file" className="mb-3">
            <Form.Label>Upload File (PDF/DOC)</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>Related Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="video" className="mb-3">
            <Form.Label>Related Video (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter video title"
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
