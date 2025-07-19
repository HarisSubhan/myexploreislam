import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publish_date: "",
    banner_image: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`/api/blogs/${id}`).then((res) => {
      const blog = res.data;
      setFormData({
        title: blog.title,
        description: blog.description,
        publish_date: blog.publish_date.split("T")[0],
        banner_image: null,
      });
    });
  }, [id]);

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
    if (formData.banner_image) {
      data.append("banner_image", formData.banner_image);
    }

    axios
      .put(`/api/blogs/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => navigate("/admin/manage-blogs"))
      .catch((err) => {
        console.error(err);
        setError("Failed to update blog");
      });
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2>✏️ Edit Blog</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control type="date" name="publish_date" value={formData.publish_date} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={4} value={formData.description} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Banner Image</Form.Label>
            <Form.Control type="file" name="banner_image" onChange={handleChange} />
          </Form.Group>
          <Button type="submit">Update</Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default EditBlog;
