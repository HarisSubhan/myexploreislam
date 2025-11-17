import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaPlay, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { getVideoByIdApi } from "../../services/videoApi";

const ModuleIntroduction = () => {
  const navigate = useNavigate();
  const { seriesId, videoId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch video data when component mounts
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const data = await getVideoByIdApi(videoId);
        setVideoData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch video data");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  const handleNext = () => {
    // Navigate to the quiz page
    navigate(`/child/series/${seriesId}/quiz/${videoId}`);
  };

  const handleBack = () => {
    navigate(`/child/series/${seriesId}`);
  };

  const handlePlayAudio = () => {
    // Implement audio playback logic here
    console.log("Play audio for:", videoData?.title);
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ background: "#f8fbff", minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="py-5"
        style={{ background: "#f8fbff", minHeight: "100vh" }}
      >
        <Alert variant="danger" className="text-center">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="py-5"
      style={{ background: "#f8fbff", minHeight: "100vh" }}
    >
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="outline-primary"
          onClick={handleBack}
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          Back to Series
        </Button>
      </div>

      {/* Series and Episode Info */}
      <div className="text-center mb-4">
        <Badge bg="primary" className="fs-6 mb-2 px-3 py-2">
          {videoData?.series_title || "Series"}
        </Badge>
        <h2 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
          Episode Introduction
        </h2>
      </div>

      {/* Episode Title */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        {videoData?.title
          ? videoData.title.toUpperCase()
          : "EPISODE INTRODUCTION"}
      </h4>

      {/* Lesson Content */}
      <Card
        className="p-4 border-0 shadow-sm mx-auto"
        style={{ borderRadius: "15px", background: "#fff", maxWidth: "800px" }}
      >
        {videoData?.description ? (
          <div
            style={{ color: "#333", fontSize: "1.1rem", lineHeight: "1.7" }}
            dangerouslySetInnerHTML={{
              __html: videoData.description.replace(/\n/g, "<br />"),
            }}
          />
        ) : (
          <p style={{ color: "#666", fontSize: "1.1rem", lineHeight: "1.7" }}>
            Welcome to this episode! Get ready to learn something amazing. This
            introduction will prepare you for the video lesson ahead.
          </p>
        )}

        {/* Learning Objectives */}
        

        {/* Voice Note */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <Button
            variant="outline-primary"
            onClick={handlePlayAudio}
            className="d-flex align-items-center"
          >
            <FaVolumeUp className="me-2" />
            Listen to Introduction
          </Button>

          {/* NEXT BUTTON ADDED HERE */}
          <Button
            onClick={handleNext}
            className="d-flex align-items-center px-4"
            style={{
              background: "linear-gradient(135deg, #ff1493, #3a86ff)",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Continue to Quiz
            <FaPlay className="ms-2" />
          </Button>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center mt-4">
        <small className="text-muted">
          Step 1 of 4: Introduction → Video → Practice → Quiz
        </small>
      </div>
    </Container>
  );
};

export default ModuleIntroduction;
