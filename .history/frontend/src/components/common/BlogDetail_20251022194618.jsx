// src/pages/BlogDetail.jsx
import React from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog, useBlogs } from "../../hooks/useBlogs";


const BlogDetail = () => {
  const { titleSlug } = useParams();
  const navigate = useNavigate();

  // Extract ID from slug or find by title - you might need to adjust this based on your API
  const extractIdFromSlug = (slug) => {
    // If your slugs contain IDs, extract them here
    // For now, we'll assume the slug is just for SEO and we need to find by title
    return null;
  };

  // Since we don't have direct ID from slug, we need to get all blogs and find the matching one
  const {
    blogs: allBlogs,
    loading: blogsLoading,
    error: blogsError,
  } = useBlogs();

  // Find the blog by matching the slugified title
  const blog = allBlogs.find((blog) => {
    const blogSlug = blog.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return blogSlug === titleSlug;
  });

  // If we found a blog, get its full details
  const {
    blog: fullBlog,
    loading: blogLoading,
    error: blogError,
  } = useBlog(blog?.id);

  const displayBlog = fullBlog || blog;

  if (blogsLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" style={{ color: "#F1066C" }} />
        <p className="mt-2">Loading blog...</p>
      </Container>
    );
  }

  if (blogsError || blogError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Error loading blog: {blogsError || blogError}
        </Alert>
        <Button variant="primary" onClick={() => navigate("/blog")}>
          Back to Blog
        </Button>
      </Container>
    );
  }

  if (!displayBlog) {
    return (
      <Container className="py-5 text-center">
        <h2>Blog post not found</h2>
        <Button variant="primary" onClick={() => navigate("/blog")}>
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button
        variant="outline-secondary"
        onClick={() => navigate("/blog")}
        className="mb-4"
      >
        ← Back to Blog
      </Button>

      <Card className="shadow-sm border-0">
        {displayBlog.banner_image && (
          <Card.Img
            variant="top"
            src={displayBlog.banner_image}
            alt={displayBlog.title}
            style={{ height: "400px", objectFit: "cover" }}
          />
        )}
        <Card.Body>
          <Card.Title style={{ color: "#F1066C", fontSize: "2rem" }}>
            {displayBlog.title}
          </Card.Title>

          <div className="mb-4">
            <small className="text-muted">
              Published:{" "}
              {new Date(displayBlog.publish_date).toLocaleDateString()}
            </small>
          </div>

          <div className="blog-content">
            {displayBlog.content ? (
              <div dangerouslySetInnerHTML={{ __html: displayBlog.content }} />
            ) : (
              <p>Content coming soon...</p>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogDetail;
