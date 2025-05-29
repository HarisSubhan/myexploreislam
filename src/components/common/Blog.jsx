import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: "1",
      title: "5 Fun Ways Kids Learn Faster",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697583910i/195096793.jpg",
      summary:
        "Discover engaging learning techniques for children using stories, colors, and interactivity!",
    },
    {
      id: "2",
      title: "Creative Learning Ideas",
      image:
        "https://m.media-amazon.com/images/I/61rtOGLC0EL._AC_UF1000,1000_QL80_.jpg",
      summary:
        "Learn how art, play, and storytelling make lessons unforgettable for young minds.",
    },
    {
      id: "3",
      title: "Kids and Technology",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=800&q=80",
      summary:
        "Explore safe and smart ways to integrate technology into your child's daily learning.",
    },
  ];

  // Function to create a URL-friendly slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-"); // Replace multiple hyphens with single
  };

  return (
    <Container fluid className="py-5">
      <h1
        style={{ color: "#F1066C" }}
        className="fw-bold text-center mb-4 display-lg-1 display-1"
      >
        Our Blog
      </h1>
      <Row className="g-4">
        {blogPosts.map((post) => (
          <Col key={post.id} xs={12} md={6} lg={4}>
            <Card className="shadow-sm h-100 border-0">
              <Card.Img
                variant="top"
                src={post.image}
                alt={post.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#F1066C" }}>
                  {post.title}
                </Card.Title>
                <Card.Text>{post.summary}</Card.Text>
                <Button
                  style={{ backgroundColor: "#F1066C" }}
                  size="sm"
                  onClick={() => navigate(`/blog/${createSlug(post.title)}`)}
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blog;
