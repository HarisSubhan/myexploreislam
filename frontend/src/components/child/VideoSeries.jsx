import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaPlay } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const seasons = [
  { title: "Season 1", color: "#FF6B6B", img: "/images/season1.png" },
  { title: "Season 2", color: "#4ECDC4", img: "/images/season2.png" },
  { title: "Season 3", color: "#FFD93D", img: "/images/season3.png" },
];

const VideoSeries = () => {
    const { category } = useParams(); 
    const navigate = useNavigate();
    const handleWatchClick = () => {
      navigate(`/child/videos/${category}/watch`);
    };

    

   
  return (
    <Container
      fluid
      className="py-5"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <h2 className="text-center fw-bold mb-5" style={{ color: "#3A86FF" }}>
        📺{category} Choose Your Season
      </h2>
      <Row className="g-4 mb-5">
        {seasons.map((season, index) => (
          <Col xs={12} sm={6} md={4} key={index}>
            <Card
              onClick={handleWatchClick}
              style={{
                borderRadius: "10px",
                border: "4px solid #fff",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "220px",
                  background: season.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {season.title}
              </div>
              <Card.Body>
                <h3>Title</h3>
                <button
                  onClick={handleWatchClick}
                  className="btn btn-primary w-100"
                >
                  Watch Now
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VideoSeries;
