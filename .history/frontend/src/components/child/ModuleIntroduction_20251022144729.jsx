import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaPlay, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // ✅ Add useLocation
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";

const ModuleIntroduction = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams();
  const location = useLocation(); // ✅ Add this
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get video data from location state
  const videoData = location.state?.currentVideo;
  const videoId = location.state?.videoId;
  const seriesData = location.state?.seriesData;

  console.log("📍 ModuleIntroduction - Location State:", location.state);
  console.log("📍 ModuleIntroduction - Video Data:", videoData);
  console.log("📍 ModuleIntroduction - Video ID:", videoId);

  // Fetch series data
  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);

        if (seriesSlug) {
          const allSeries = await getSeriesApi();
          const foundSeries = allSeries.find((seriesItem) => {
            const seriesSlugFromName = createSlug(
              seriesItem.name || seriesItem.title
            );
            return seriesSlugFromName === seriesSlug;
          });

          if (foundSeries) {
            setSeries(foundSeries);
          }
        }
      } catch (err) {
        setError("Failed to load series data");
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesSlug]);

  const handleNext = () => {
    console.log("➡️ Navigating to ModulePage1 with video:", videoData?.title);

    // ✅ Navigate to ModulePage1 with video data
    navigate(`/child/module/${seriesSlug}/page1/${videoId}`, {
      state: {
        currentVideo: videoData,
        seriesData: seriesData || series,
        videoId: videoId,
      },
    });
  };

  const handleBack = () => {
    navigate("/child/module");
  };

  const handlePlayAudio = () => {
    console.log("Play audio for series:", series?.name);
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
          Back to Modules
        </Button>
      </div>

      {/* Series Info */}
      <div className="text-center mb-4">
        <Badge bg="primary" className="fs-6 mb-2 px-3 py-2">
          {series?.name || "Learning Series"}
        </Badge>
        <h2 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
          Series Introduction
        </h2>
        {videoData && (
          <p className="text-muted">
            Next: <strong>{videoData.title}</strong>
          </p>
        )}
      </div>

      {/* Series Title */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        {series?.name ? series.name.toUpperCase() : "INTRODUCTION"}
      </h4>

      {/* Lesson Content */}
      <Card
        className="p-4 border-0 shadow-sm mx-auto"
        style={{ borderRadius: "15px", background: "#fff", maxWidth: "800px" }}
      >
        {series?.description ? (
          <div
            style={{ color: "#333", fontSize: "1.1rem", lineHeight: "1.7" }}
            dangerouslySetInnerHTML={{
              __html: series.description.replace(/\n/g, "<br />"),
            }}
          />
        ) : (
          <p style={{ color: "#666", fontSize: "1.1rem", lineHeight: "1.7" }}>
            Welcome to this learning series! Get ready to explore amazing
            content and enhance your knowledge. This introduction will prepare
            you for the learning journey ahead.
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
            disabled={!videoData} // Disable if no video selected
          >
            Continue to Video
            <FaPlay className="ms-2" />
          </Button>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center mt-4">
        <small className="text-muted">
          Step 1 of 4: Introduction → Video → Quiz → Completion
        </small>
      </div>

      {/* Debug Info */}
      <div className="text-center mt-4">
        <small className="text-muted">
          Video: {videoData?.title || "Not selected"} | ID:{" "}
          {videoId || "Not available"}
        </small>
      </div>
    </Container>
  );
};

export default ModuleIntroduction;
