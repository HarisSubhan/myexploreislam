import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetail = () => {
  const { id, titleSlug } = useParams();
  const navigate = useNavigate();

  // Sample blog data - in a real app, you'd fetch this based on the ID
  const blogs = [
    {
      id: "1",
      title: "5 Fun Ways Kids Learn Faster",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697583910i/195096793.jpg",
      content: `
        <h3>Discover engaging learning techniques for children</h3>
        <p>Research shows that children learn best when they're having fun. Here are 5 proven methods:</p>
        <ol>
          <li><strong>Story-based learning:</strong> Children retain information better when it's wrapped in a narrative.</li>
          <li><strong>Colorful visuals:</strong> Using bright colors stimulates memory and engagement.</li>
          <li><strong>Interactive games:</strong> Hands-on activities reinforce concepts through play.</li>
          <li><strong>Musical mnemonics:</strong> Setting information to music improves recall.</li>
          <li><strong>Movement breaks:</strong> Physical activity boosts cognitive function.</li>
        </ol>
        <p>Implementing these techniques can make learning more effective and enjoyable for children of all ages.</p>
      `,
    },
    {
      id: "2",
      title: "Creative Learning Ideas",
      image:
        "hhttps://m.media-amazon.com/images/I/61rtOGLC0EL._AC_UF1000,1000_QL80_.jpg",
      content: `
          <h3>Discover engaging learning techniques for children</h3>
          <p>Research shows that children learn best when they're having fun. Here are 5 proven methods:</p>
          <ol>
            <li><strong>Story-based learning:</strong> Children retain information better when it's wrapped in a narrative.</li>
            <li><strong>Colorful visuals:</strong> Using bright colors stimulates memory and engagement.</li>
            <li><strong>Interactive games:</strong> Hands-on activities reinforce concepts through play.</li>
            <li><strong>Musical mnemonics:</strong> Setting information to music improves recall.</li>
            <li><strong>Movement breaks:</strong> Physical activity boosts cognitive function.</li>
          </ol>
          <p>Implementing these techniques can make learning more effective and enjoyable for children of all ages.</p>
        `,
    },
    {
      id: "3",
      title: "Kids and Technology",
      image:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697583910i/195096793.jpg",
      content: `
          <h3>Discover engaging learning techniques for children</h3>
          <p>Research shows that children learn best when they're having fun. Here are 5 proven methods:</p>
          <ol>
            <li><strong>Story-based learning:</strong> Children retain information better when it's wrapped in a narrative.</li>
            <li><strong>Colorful visuals:</strong> Using bright colors stimulates memory and engagement.</li>
            <li><strong>Interactive games:</strong> Hands-on activities reinforce concepts through play.</li>
            <li><strong>Musical mnemonics:</strong> Setting information to music improves recall.</li>
            <li><strong>Movement breaks:</strong> Physical activity boosts cognitive function.</li>
          </ol>
          <p>Implementing these techniques can make learning more effective and enjoyable for children of all ages.</p>
        `,
    },
  ];

  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
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
        <Card.Img
          variant="top"
          src={blog.image}
          alt={blog.title}
          style={{ height: "400px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title style={{ color: "#F1066C", fontSize: "2rem" }}>
            {blog.title}
          </Card.Title>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogDetail;
