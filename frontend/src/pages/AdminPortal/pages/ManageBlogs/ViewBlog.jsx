import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/public/${id}`);
        setBlog(res.data);
      } catch (err) {
        setError("Failed to load blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center p-4">
          <Spinner animation="border" />
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

  if (!blog) {
    return (
      <AdminLayout>
        <div className="p-4">
          <Alert variant="warning">No blog found.</Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h2>{blog.title}</h2>
        <p>
          <strong>Published:</strong>{" "}
          {blog.publish_date
            ? new Date(blog.publish_date).toLocaleDateString()
            : "N/A"}
        </p>

        {blog.banner_image || blog.banner ? (
          <img
            src={blog.banner_image || blog.banner}
            alt="Banner"
            className="img-fluid rounded mb-4"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        ) : (
          <p className="text-muted">No banner available</p>
        )}

        <Card>
          <Card.Body>
            <div
              dangerouslySetInnerHTML={{ __html: blog.description || "<p>No description provided.</p>" }}
            />
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewBlog;
