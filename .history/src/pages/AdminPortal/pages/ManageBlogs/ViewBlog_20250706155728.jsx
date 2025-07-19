
import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`/api/blogs/${id}`).then((res) => setBlog(res.data));
  }, [id]);

  if (!blog) return <Spinner animation="border" className="m-4" />;

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
