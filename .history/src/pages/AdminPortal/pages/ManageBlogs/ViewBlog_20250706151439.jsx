import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Button, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../AdminApp";

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/blogs/${id}`
        );
        setBlog(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load blog. Please try again."
        );
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    // Retry after 1 second to avoid immediate retry
    setTimeout(() => window.location.reload(), 1000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading blog...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Blog</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                variant="outline-danger"
                onClick={() => navigate(-1)}
                className="me-2"
              >
                ← Go Back
              </Button>
              <Button variant="primary" onClick={retryFetch}>
                Retry
              </Button>
            </div>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>📖 {blog.title}</h2>
          <Badge bg="secondary">ID: {blog.id}</Badge>
        </div>

        <div className="mb-4">
          <p className="mb-1">
            <strong>Published:</strong>{" "}
            {new Date(blog.publish_date).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>Created At:</strong>{" "}
            {new Date(blog.created_at).toLocaleString()}
          </p>
        </div>

        {blog.banner_image ? (
          <img
            src={blog.banner_image}
            alt="Banner"
            className="img-fluid rounded mb-4"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        ) : (
          <div className="bg-light p-5 rounded mb-4 text-center">
            <p className="text-muted">No banner image available</p>
          </div>
        )}

        <Card>
          <Card.Body>
            <Card.Title>Blog Content</Card.Title>
            {blog.description ? (
              <div dangerouslySetInnerHTML={{ __html: blog.description }} />
            ) : (
              <p className="text-muted">No content available</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewBlog;
