import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FaUserEdit, FaEnvelope, FaPhone, FaChild } from 'react-icons/fa';
import { getUserNameApi } from '../../../services/api'; 

const ParentProfile = () => {
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParent = async () => {
      try {
        const { name, email } = await getUserNameApi();

        setParent({
          name,
          email,
          phone: "+123 456 7890",
          avatar: "https://i.pravatar.cc/150?img=12",
          children: [
            { name: "Alice", age: 10 },
            { name: "Bob", age: 8 }
          ]
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParent();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!parent) {
    return (
      <Container className="text-center mt-5">
        <p>Failed to load parent profile.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg rounded-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4} className="text-center mb-3">
                  <img
                    src={parent.avatar}
                    alt="Parent Avatar"
                    className="img-fluid rounded-circle border"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                </Col>
                <Col md={8}>
                  <h3>{parent.name}</h3>
                  <p><FaEnvelope className="me-2 text-primary" />{parent.email}</p>
                  <p><FaPhone className="me-2 text-success" />{parent.phone}</p>
                  
                </Col>
              </Row>

              <hr className="my-4" />

              <h5><FaChild className="me-2" />Children</h5>
              <Row>
                {parent.children.map((child, index) => (
                  <Col md={6} key={index} className="mb-3">
                    <Card className="border-0 shadow-sm rounded-3">
                      <Card.Body>
                        <h6 className="mb-1">{child.name}</h6>
                        <small className="text-muted">Age: {child.age}</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentProfile;
