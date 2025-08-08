import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const recommendedVideos = [
  {
    id: 1,
    title: "Learn React in 10 Minutes",
    thumbnail: "https://img.youtube.com/vi/dGcsHMXbSOA/hqdefault.jpg",
    channel: "Code Academy",
    
    duration: "10:05",
  },
  {
    id: 2,
    title: "JavaScript Basics Tutorial",
    thumbnail: "https://img.youtube.com/vi/hdI2bqOjy3c/hqdefault.jpg",
    channel: "JS Mastery",
    
    duration: "15:20",
  },
  {
    id: 3,
    title: "CSS Grid Crash Course",
    thumbnail: "https://img.youtube.com/vi/jV8B24rSN5o/hqdefault.jpg",
    channel: "Design Simplified",
    
    duration: "12:30",
  },
  // Add more recommended videos here
];

const VideoWatch = () => {
  return (
    <Container fluid className="py-4" style={{ maxWidth: "1200px" }}>
      <Row>
       
        <Col md={8}>
          <div className="video-player-wrapper">
            <iframe
              width="100%"
              height="450"
              src="https://www.youtube.com/embed/dGcsHMXbSOA"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <h3 className="mt-3">Learn React in 10 Minutes</h3>
         

          

          <div className="video-description border rounded p-3">
            <p>
              This is a quick React tutorial for beginners covering all the
              basics you need to get started with React in just 10 minutes!
            </p>
            <p>
              <strong>Chapters:</strong> Introduction, Components, JSX, Props,
              State, Lifecycle, Hooks, and More.
            </p>
          </div>
        </Col>

        
        <Col md={4}>
          <h5>Recommended Videos</h5>
          {recommendedVideos.map((video) => (
            <Card
              key={video.id}
              className="mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => alert(`Navigate to video id ${video.id}`)}
            >
              <Row className="g-0">
                <Col xs={5}>
                  <div
                    style={{
                      backgroundImage: `url(${video.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "80px",
                      borderRadius: "4px",
                    }}
                  />
                </Col>
                <Col xs={7}>
                  <Card.Body style={{ padding: "0 10px" }}>
                    <Card.Title
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        lineHeight: "1.2rem",
                      }}
                    >
                      {video.title}
                    </Card.Title>
                    <Card.Text style={{ fontSize: "0.8rem", color: "#555" }}>
                      {video.channel}
                    </Card.Text>
                    <Card.Text style={{ fontSize: "0.75rem", color: "#777" }}>
                      {video.views}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default VideoWatch;
