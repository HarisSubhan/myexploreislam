import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Blog = () => {
  return (
    <Container fluid className="p-5">
      <h1 style={{ color: '#F1066C' }} className="fw-bold text-center mb-4 display-lg-1 display-1">
        Our Blog
      </h1>
      <Row className="g-4">
        {/* Blog Card 1 */}
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Img
              variant="top"
              src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1697583910i/195096793.jpg"
              alt="Educational Blog for Kids"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title style={{ color: '#F1066C' }}>5 Fun Ways Kids Learn Faster</Card.Title>
              <Card.Text>
                Discover engaging learning techniques for children using stories, colors, and interactivity!
              </Card.Text>
              <Button style={{backgroundColor:"#F1066C"}} size="sm">Read More</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Blog Card 2 */}
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Img
              variant="top"
              src="https://m.media-amazon.com/images/I/61rtOGLC0EL._AC_UF1000,1000_QL80_.jpg"
              alt="Creative Learning Ideas"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title style={{ color: '#F1066C' }}>Creative Learning Ideas</Card.Title>
              <Card.Text>
                Learn how art, play, and storytelling make lessons unforgettable for young minds.
              </Card.Text>
              <Button style={{backgroundColor:"#F1066C"}} size="sm">Read More</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Blog Card 3 */}
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Img
              variant="top"
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=800&q=80"
              alt="Kids and Technology"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title style={{ color: '#F1066C' }}>Kids and Technology</Card.Title>
              <Card.Text>
                Explore safe and smart ways to integrate technology into your child’s daily learning.
              </Card.Text>
              <Button style={{backgroundColor:"#F1066C"}} size="sm">Read More</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Blog;
