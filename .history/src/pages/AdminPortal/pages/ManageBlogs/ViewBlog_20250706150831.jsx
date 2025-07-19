// ✅ File: ViewBlog.js
import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get(`/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load blog");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4">
          <Alert variant="danger">{error}</Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h2>📖 {blog.title}</h2>
        <p><strong>Published:</strong> {new Date(blog.publish_date).toLocaleDateString()}</p>
        <img
          src={blog.banner_image || blog.banner}
          alt="Banner"
          className="img-fluid rounded mb-4"
          style={{ maxHeight: "300px" }}
        />
        <Card>
          <Card.Body>
            <p>{blog.description}</p>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewBlog;