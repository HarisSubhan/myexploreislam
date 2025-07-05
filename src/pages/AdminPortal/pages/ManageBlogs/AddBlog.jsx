import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publish_date: "",
    banner_image: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "banner_image") {
      setFormData({ ...formData, banner_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("publish_date", formData.publish_date);
    data.append("banner_image", formData.banner_image);

    axios
      .post("/api/blogs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => navigate("/admin/manage-blogs"))
      .catch((err) => {
        console.error(err);
        setError("Failed to create blog");
      });
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2>➕ Add New Blog</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control type="date" name="publish_date" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={4} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Banner Image</Form.Label>
            <Form.Control type="file" name="banner_image" onChange={handleChange} required />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AddBlog;
