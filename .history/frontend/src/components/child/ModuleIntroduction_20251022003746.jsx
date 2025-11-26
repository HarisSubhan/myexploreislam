import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaPlay, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  const { seriesSlug } = useParams(); // ✅ Changed from seriesId to seriesSlug
  const location = useLocation();

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get video data from navigation state or fetch it
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // ✅ Check if video data is passed via state
        if (location.state?.videoData) {
          setVideoData(location.state.videoData);
          setLoading(false);
          return;
        }

        // ✅ If videoId is available in state, fetch video data
        if (location.state?.videoId) {
          const data = await getVideoByIdApi(location.state.videoId);
          setVideoData(data);
        } else {
          // ✅ Default behavior for series introduction
          setVideoData({
            title: "Series Introduction",
            description:
              "Welcome to this learning series! Get ready to explore amazing content and enhance your knowledge.",
            series_title: location.state?.seriesData?.name || "Learning Series",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load introduction data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.state]);

  const handleNext = () => {
    // ✅ Navigate to page1 for the series
    navigate(`page1`, {
      state: {
        videoData: videoData,
        seriesData: location.state?.seriesData,
      },
    });
  };

  const handleBack = () => {
    navigate(`/child/module/${seriesSlug}`);
  };

  const handlePlayAudio = () => {
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
          {videoData?.series_title || "Learning Series"}
        </Badge>
        <h2 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
          {location.state?.videoData
            ? "Episode Introduction"
            : "Series Introduction"}
        </h2>
      </div>

      {/* Episode Title */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        {videoData?.title ? videoData.title.toUpperCase() : "INTRODUCTION"}
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
            Welcome to this {location.state?.videoData ? "episode" : "series"}!
            Get ready to learn something amazing. This introduction will prepare
            you for the{" "}
            {location.state?.videoData ? "video lesson" : "learning journey"}{" "}
            ahead.
          </p>
        )}

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

          {/* NEXT BUTTON */}
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
            Continue to Next
            <FaPlay className="ms-2" />
          </Button>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center mt-4">
        <small className="text-muted">
          Step 1 of 4: Introduction → Content → Practice → Quiz
        </small>
      </div>
    </Container>
  );
};

export default ModuleIntroduction;
