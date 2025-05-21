import React from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { IoPerson } from 'react-icons/io5';

const ParentCard = () => {
  const cardData = [
    { count: '02', label: 'Total Child Account' },
    { count: '01', label: 'Active Account' },
    { count: '02', label: 'Inactive Account' },
  ];

  return (
    <Container fluid className="my-4">
      <Row className="g-3">
        {cardData.map((item, index) => (
          <Col key={index} xs={12} md={4}>
            <Card className="shadow-sm rounded-3 h-100">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="h4 mb-1">{item.count}</p>
                  <p className="mb-0 text-muted">{item.label}</p>
                </div>
                <div className="fs-2 text-primary">
                  <IoPerson />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ParentCard;
