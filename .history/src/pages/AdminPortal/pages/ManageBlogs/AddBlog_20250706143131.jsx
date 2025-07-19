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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "banner_image") {
      setFormData({ ...formData, banner_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("publish_date", formData.publish_date);
      if (formData.banner_image) {
        data.append("banner_image", formData.banner_image);
      }

      const response = await axios.post("/api/blogs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        navigate("/admin/manage-blogs");
      } else {
        throw new Error(response.data.message || "Failed to create blog");
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to create blog"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2>➕ Add New Blog</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control
              type="date"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Banner Image</Form.Label>
            <Form.Control
              type="file"
              name="banner_image"
              onChange={handleChange}
              required
              accept="image/*"
            />
          </Form.Group>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AddBlog;
