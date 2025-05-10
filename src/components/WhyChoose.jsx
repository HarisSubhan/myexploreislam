import React from 'react'
import { Col, Container, Row, Card  } from 'react-bootstrap'

const WhyChoose = () => {
  return (
    <>
       <Container className="my-5 py-4">
      <Row className="justify-content-center">
        <Col xs={12} className="text-center mb-5">
        <img src="" alt="" />
          <h1 className="display-4 fw-bold" style={{ color: "#f1066c" }}>
            Why Choose Explore Islam?
          </h1>
        </Col>
      </Row>
      
      <Row className="g-4 justify-content-center">
        {/* Feature 1 */}
        <Col md={4} className="d-flex">
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-4">
              <h3 className="h4 mb-4 d-flex align-items-center">
                <span className="me-2" style={{ color: "#f1066c", fontSize: '1.5rem' }}>✔</span>
                Fun & Interactive Learning
              </h3>
              <p className="mb-0">
                Kids enjoy & learn from animated cartoons, quizzes, and worksheets.
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Feature 2 */}
        <Col md={4} className="d-flex">
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-4">
              <h3 className="h4 mb-4 d-flex align-items-center">
                <span className="me-2" style={{ color: "#f1066c", fontSize: '1.5rem' }}>✔</span>
                Easy for Parents
              </h3>
              <p className="mb-0">
                Track your child's progress in real time.
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Feature 3 */}
        <Col md={4} className="d-flex">
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-4">
              <h3 className="h4 mb-4 d-flex align-items-center">
                <span className="me-2" style={{ color: "#f1066c", fontSize: '1.5rem' }}>✔</span>
                Authentic & Reliable
              </h3>
              <p className="mb-0">
                Content is based on Quran and authentic Hadith.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  )
}

export default WhyChoose
