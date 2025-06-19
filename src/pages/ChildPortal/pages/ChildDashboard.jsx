import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import VideoSlider from "../../../components/child/VideoSlider";
import Book from "../../../components/child/Book";
import { FaBook, FaVideo } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";


const ChildDashboard = () => {
    const { color: themeColor, textColor } = useTheme();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <Container fluid>
        <Row className="mb-5 text-center">
          <Col>
            <h1 className="text-3xl fw-bold text-indigo-800 mb-2">Learning Fun!</h1>
            <p className="text-lg text-muted">Explore Books and Videos Just For You</p>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <FaBook className="text-2xl text-purple-600 me-2" />
              <h2 className="text-2xl fw-semibold text-gray-800">Your Books</h2>
            </div>
            <Card style={{ backgroundColor: themeColor, color: textColor }} className="border-0 shadow-sm hover-shadow transition-all">
              <Card.Body className="p-4">
                <Book />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <FaVideo className="text-2xl text-blue-600 me-2" />
              <h2 className="text-2xl fw-semibold text-gray-800">Learning Videos</h2>
            </div>
            <Card style={{ backgroundColor: themeColor, color: textColor }} className="border-0 shadow-sm hover-shadow transition-all">
              <Card.Body className="p-4">
                <VideoSlider />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        
      </Container>
    </div>
  );
};

export default ChildDashboard;