// src/pages/BlogPage.jsx
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../../hooks/";

const BlogPage = () => {
  const navigate = useNavigate();
  const { blogs, loading, error } = useBlogs();

  // Function to create a URL-friendly slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  // Function to generate summary from description (strip HTML tags)
  const generateSummary = (description) => {
    if (!description) return "Read more about this topic...";

    // Strip HTML tags and get first 100 characters
    const plainText = description.replace(/<[^>]*>/g, "");
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  // Default image in case banner_image is null
  const getImageUrl = (bannerImage) => {
    return (
      bannerImage ||
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60"
    );
  };

  if (loading) {
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" style={{ color: "#F1066C" }} />
        <p className="mt-2">Loading blogs...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5">
        <Alert variant="danger">Error loading blogs: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      <h1
        style={{ color: "#F1066C" }}
        className="fw-bold text-center mb-4 display-lg-1 display-1"
      >
        Our Blog
      </h1>
      <Row className="g-4">
        {blogs.length === 0 ? (
          <Col xs={12} className="text-center">
            <p>No blog posts found.</p>
          </Col>
        ) : (
          blogs.map((post) => (
            <Col key={post.id} xs={12} md={6} lg={4}>
              <Card className="shadow-sm h-100 border-0">
                <Card.Img
                  variant="top"
                  src={getImageUrl(post.banner_image)}
                  alt={post.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "#F1066C" }}>
                    {post.title}
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    {generateSummary(post.description)}
                  </Card.Text>
                  <div className="mt-auto">
                    <small className="text-muted d-block mb-2">
                      Published:{" "}
                      {new Date(post.publish_date).toLocaleDateString()}
                    </small>
                    <Button
                      style={{ backgroundColor: "#F1066C", border: "none" }}
                      size="sm"
                      onClick={() =>
                        navigate(`/blog/${createSlug(post.title)}`)
                      }
                    >
                      Read More
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default BlogPage;
