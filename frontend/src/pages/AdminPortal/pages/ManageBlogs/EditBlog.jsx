import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Image } from "react-bootstrap";
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

  const [existingBanner, setExistingBanner] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api//blogs/public/${id}`);
        const blog = res.data;
        setFormData({
          title: blog.title,
          description: blog.description,
          publish_date: blog.publish_date?.split("T")[0] || "",
          banner_image: null,
        });
        setExistingBanner(blog.banner_image || blog.banner || "");
      } catch (err) {
        setError("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

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
    setSubmitting(true);
    setError("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("publish_date", formData.publish_date);
    if (formData.banner_image) {
      data.append("banner_image", formData.banner_image);
    }

    try {
      await axios.put(`/api/blogs/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/admin/manage-blogs");
    } catch (err) {
      console.error(err);
      setError("Failed to update blog.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center p-5">
          <Spinner animation="border" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h2>✏️ Edit Blog</h2>
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
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Banner Image</Form.Label>
            {existingBanner && !formData.banner_image && (
              <div className="mb-2">
                <Image
                  src={existingBanner}
                  alt="Current Banner"
                  thumbnail
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              name="banner_image"
              accept="image/*"
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Blog"}
          </Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default EditBlog;
