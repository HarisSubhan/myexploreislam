import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaPlay, FaArrowLeft, FaVideo } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";

const ModuleIntroduction = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams();
  const location = useLocation();

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get ALL data from location state
  const videoData = location.state?.currentVideo;
  const videoId = location.state?.videoId;
  const seriesData = location.state?.seriesData;
  const stateSeriesSlug = location.state?.seriesSlug;

  // ✅ Use the correct series slug (from URL or state)
  const finalSeriesSlug = seriesSlug || stateSeriesSlug;

  console.log("📍 ModuleIntroduction - Debug Info:");
  console.log("📍 URL Series Slug:", seriesSlug);
  console.log("📍 Location State:", location.state);
  console.log("📍 Video Data:", videoData);
  console.log("📍 Video ID:", videoId);
  console.log("📍 Final Series Slug:", finalSeriesSlug);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Fetching series data for slug:", finalSeriesSlug);

        if (finalSeriesSlug) {
          const allSeries = await getSeriesApi();
          const foundSeries = allSeries.find((seriesItem) => {
            const seriesSlugFromName = createSlug(
              seriesItem.name || seriesItem.title
            );
            return seriesSlugFromName === finalSeriesSlug;
          });

          if (foundSeries) {
            console.log("✅ Found series:", foundSeries.name);
            setSeries(foundSeries);
          } else {
            console.error("❌ Series not found for slug:", finalSeriesSlug);
            setError("Series not found");
          }
        } else {
          console.error("❌ No series slug provided");
          setError("No series selected");
        }
      } catch (err) {
        console.error("❌ Error fetching series data:", err);
        setError("Failed to load series data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [finalSeriesSlug]);

  // ✅ FIXED: Working navigation function
  const handleContinue = () => {
    console.log("🎬 Continue button clicked");
    console.log("📍 Current video data:", videoData);
    console.log("📍 Current video ID:", videoId);
    console.log("📍 Current series slug:", finalSeriesSlug);

    if (!finalSeriesSlug) {
      console.error("❌ No series slug available for navigation");
      setError("Cannot continue: Series information missing");
      return;
    }

    if (!videoId && !videoData) {
      console.error("❌ No video data available for navigation");
      setError("Cannot continue: Video information missing");
      return;
    }

    // ✅ Navigate to ModulePage1 with ALL necessary data
    const targetVideoId = videoId || videoData?.id;

    console.log(
      "➡️ Navigating to:",
      `/child/module/${finalSeriesSlug}/page1/${targetVideoId}`
    );

    navigate(`/child/module/${finalSeriesSlug}/page1/${targetVideoId}`, {
      state: {
        currentVideo: videoData,
        seriesData: seriesData || series,
        videoId: targetVideoId,
        seriesSlug: finalSeriesSlug,
      },
    });
  };

  const handleBack = () => {
    console.log("⬅️ Going back to modules");
    navigate("/child/module");
  };

  const handlePlayAudio = () => {
    console.log("🔊 Playing audio for series:", series?.name);
    // Add your audio playback logic here
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ background: "#f8fbff", minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading introduction...</p>
        </div>
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
          <h5>Error Loading Introduction</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleBack}
              className="ms-2"
            >
              Back to Modules
            </Button>
          </div>
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

      {/* Header Section */}
      <div className="text-center mb-5">
        <Badge bg="primary" className="fs-6 mb-3 px-3 py-2">
          {series?.name || "Learning Series"}
        </Badge>
        <h1 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
          Welcome to the Series!
        </h1>
        <p className="text-muted fs-5">
          Get ready for an amazing learning journey
        </p>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Series Info Card */}
          <Card
            className="border-0 shadow-lg mb-4"
            style={{ borderRadius: "20px", overflow: "hidden" }}
          >
            <Card.Body className="p-5">
              {/* Upcoming Video Info */}
              {videoData && (
                <div className="text-center mb-4 p-3 bg-light rounded-3">
                  <FaVideo className="text-primary mb-2" size={24} />
                  <h5 className="fw-bold">Upcoming Video</h5>
                  <p className="mb-1 fs-5">{videoData.title}</p>
                  <small className="text-muted">
                    {videoData.description || "Get ready to learn!"}
                  </small>
                </div>
              )}

              <h3
                className="fw-bold text-center mb-4"
                style={{ color: "#3a86ff" }}
              >
                {series?.name
                  ? series.name.toUpperCase()
                  : "SERIES INTRODUCTION"}
              </h3>

              {/* Series Description */}
              <div className="mb-4">
                {series?.description ? (
                  <div
                    style={{
                      color: "#333",
                      fontSize: "1.1rem",
                      lineHeight: "1.7",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: series.description.replace(/\n/g, "<br />"),
                    }}
                  />
                ) : (
                  <p
                    style={{
                      color: "#666",
                      fontSize: "1.1rem",
                      lineHeight: "1.7",
                    }}
                  >
                    Welcome to this exciting learning series! In this course,
                    you'll explore amazing content and enhance your knowledge
                    through engaging videos and interactive quizzes. Get ready
                    to embark on a fun learning adventure!
                  </p>
                )}
              </div>

              {/* Features List */}
              <Row className="mb-4">
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle p-2 me-3">
                      <FaVideo className="text-white" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Engaging Videos</h6>
                      <small className="text-muted">
                        Learn through visual content
                      </small>
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle p-2 me-3">
                      <FaPlay className="text-white" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Interactive Quizzes</h6>
                      <small className="text-muted">Test your knowledge</small>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
                <Button
                  variant="outline-primary"
                  onClick={handlePlayAudio}
                  className="d-flex align-items-center px-4 py-2"
                >
                  <FaVolumeUp className="me-2" />
                  Listen Introduction
                </Button>

                {/* ✅ FIXED: Working Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="d-flex align-items-center px-5 py-2"
                  style={{
                    background: "linear-gradient(135deg, #ff1493, #3a86ff)",
                    border: "none",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  disabled={!videoId && !videoData}
                >
                  Start Learning
                  <FaPlay className="ms-2" />
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Progress Indicator */}
          <div className="text-center">
            <div className="d-flex justify-content-center align-items-center mb-2">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                      step === 1
                        ? "bg-primary text-white"
                        : "bg-light text-muted"
                    }`}
                    style={{
                      width: "40px",
                      height: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className="bg-light mx-2"
                      style={{ height: "2px", width: "40px" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <small className="text-muted">
              Step 1 of 4: Introduction → Video → Quiz → Completion
            </small>
          </div>

          {/* Debug Info - Remove in production */}
          <Card className="mt-4 border-warning">
            <Card.Body>
              <small className="text-muted">
                <strong>Debug Info:</strong> Series: {series?.name} | Video:{" "}
                {videoData?.title || "None"} | Video ID: {videoId || "None"} |
                Slug: {finalSeriesSlug || "None"}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModuleIntroduction;
