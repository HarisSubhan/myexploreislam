import React, { useState, useEffect } from "react";
import {
  FaVolumeUp,
  FaPlay,
  FaArrowLeft,
  FaVideo,
  FaExclamationTriangle,
} from "react-icons/fa";
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
import { getAllVideosApi, getVideoByIdApi } from "../../services/videoApi";
import { createSlug } from "../../utils/slugify";

const ModuleIntroduction = () => {
  const navigate = useNavigate();
  const { seriesSlug, videoId } = useParams();
  const location = useLocation();

  const [series, setSeries] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get ALL possible data from location state
  const locationState = location.state || {};
  const videoDataFromState = locationState.currentVideo;
  const videoIdFromState = locationState.videoId;
  const seriesDataFromState = locationState.seriesData;
  const preSelectedVideo = locationState.selectedVideo;

  console.log("📍 ModuleIntroduction - Debug Info:");
  console.log("📍 URL Series Slug:", seriesSlug);
  console.log("📍 URL Video ID:", videoId);
  console.log("📍 Full Location State:", locationState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Starting data fetch...");

        // ✅ CASE 1: Single Video Flow
        if (videoId && !seriesSlug) {
          console.log("🎯 Single Video Flow detected");
          await handleSingleVideoFlow();
        }
        // ✅ CASE 2: Series Flow
        else if (seriesSlug) {
          console.log("🎯 Series Flow detected");
          await handleSeriesFlow();
        }
        // ✅ CASE 3: No parameters - use location state
        else if (videoDataFromState || seriesDataFromState) {
          console.log("🎯 Location State Flow detected");
          await handleLocationStateFlow();
        } else {
          setError("No module data available");
        }
      } catch (err) {
        console.error("❌ Error in fetchData:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleSingleVideoFlow = async () => {
      let videoData = videoDataFromState;

      if (!videoData && videoId) {
        console.log("🔄 Fetching single video by ID:", videoId);
        videoData = await getVideoByIdApi(videoId);
      }

      if (videoData) {
        setSelectedVideo(videoData);
        setSeries({
          name: videoData.title,
          description: videoData.description,
          id: videoData.id,
        });
        setVideos([videoData]);
        console.log("✅ Single video loaded:", videoData.title);
      } else {
        throw new Error("Could not load video data");
      }
    };

    const handleSeriesFlow = async () => {
      console.log("🔄 Fetching series data for:", seriesSlug);

      // Get series data
      const allSeries = await getSeriesApi();
      const foundSeries = allSeries.find((seriesItem) => {
        const seriesSlugFromName = createSlug(
          seriesItem.name || seriesItem.title
        );
        return seriesSlugFromName === seriesSlug;
      });

      if (!foundSeries) {
        throw new Error("Series not found");
      }

      console.log("✅ Found series:", foundSeries.name);
      setSeries(foundSeries);

      // Get videos for this series
      const allVideos = await getAllVideosApi();
      const seriesVideos = allVideos.filter(
        (video) => video.series_id == foundSeries.id
      );
      setVideos(seriesVideos);
      console.log("🎥 Series videos:", seriesVideos);

      // Select the appropriate video
      let videoToSelect = null;

      // Priority 1: Video from location state
      if (videoDataFromState) {
        videoToSelect = videoDataFromState;
        console.log("🎯 Using video from location state");
      }
      // Priority 2: Video ID from location state
      else if (videoIdFromState) {
        videoToSelect = seriesVideos.find((v) => v.id == videoIdFromState);
        console.log("🎯 Using video from videoId in state");
      }
      // Priority 3: Pre-selected video from location state
      else if (preSelectedVideo) {
        videoToSelect = preSelectedVideo;
        console.log("🎯 Using pre-selected video from state");
      }
      // Priority 4: First video in series
      else if (seriesVideos.length > 0) {
        videoToSelect = seriesVideos[0];
        console.log("🎯 Using first video in series");
      }

      if (videoToSelect) {
        setSelectedVideo(videoToSelect);
        console.log("✅ Selected video:", videoToSelect.title);
      } else {
        console.warn("⚠️ No video selected for series");
      }
    };

    const handleLocationStateFlow = async () => {
      if (seriesDataFromState) {
        setSeries(seriesDataFromState);
        console.log("🎯 Using series data from location state");
      }

      if (videoDataFromState) {
        setSelectedVideo(videoDataFromState);
        console.log("🎯 Using video data from location state");

        // If we have video but no series, create a mock series for single video
        if (!seriesDataFromState) {
          setSeries({
            name: videoDataFromState.title,
            description: videoDataFromState.description,
            id: videoDataFromState.id,
          });
          setVideos([videoDataFromState]);
        }
      }
    };

    fetchData();
  }, [seriesSlug, videoId, location.state]);

  // ✅ SIMPLIFIED: Navigation function
  const handleContinue = () => {
    if (!selectedVideo) {
      setError("Please select a video first");
      return;
    }

    const navigationState = {
      currentVideo: selectedVideo,
      videoId: selectedVideo.id,
      seriesData: series,
      seriesSlug: seriesSlug,
    };

    // Determine the correct navigation path
    if (videoId && !seriesSlug) {
      // Single video flow
      navigate(`/child/module/single/${selectedVideo.id}/page1`, {
        state: navigationState,
      });
    } else if (seriesSlug) {
      // Series flow
      navigate(`/child/module/series/${seriesSlug}/page1/${selectedVideo.id}`, {
        state: navigationState,
      });
    } else {
      // Fallback
      navigate(`/child/module/series/${seriesSlug}/page1/${selectedVideo.id}`, {
        state: navigationState,
      });
    }

    console.log("➡️ Navigating with:", navigationState);
  };

  const handleVideoSelect = (video) => {
    console.log("🎬 Video selected:", video.title);
    setSelectedVideo(video);
  };

  const handleBack = () => {
    navigate("/child/module");
  };

  const handlePlayAudio = () => {
    console.log("🔊 Playing audio");
  };

  // Render loading state
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

  // Render error state
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
          {series?.name || "Learning Module"}
        </Badge>
        <h1 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
          Welcome!
        </h1>
        <p className="text-muted fs-5">
          Get ready for an amazing learning journey
        </p>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card
            className="border-0 shadow-lg mb-4"
            style={{ borderRadius: "20px", overflow: "hidden" }}
          >
            <Card.Body className="p-5">
              {/* Video Selection - Only show for series with multiple videos */}
              {videos.length > 1 && (
                <div className="mb-4 p-3 bg-light rounded-3">
                  <h5 className="fw-bold mb-3">
                    <FaVideo className="text-primary me-2" />
                    Select Video to Start
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {videos.map((video, index) => (
                      <Button
                        key={video.id}
                        variant={
                          selectedVideo?.id === video.id
                            ? "primary"
                            : "outline-primary"
                        }
                        size="sm"
                        onClick={() => handleVideoSelect(video)}
                        className="mb-2"
                      >
                        Episode {index + 1}: {video.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Video Info */}
              {selectedVideo && (
                <div className="text-center mb-4 p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25">
                  <FaVideo className="text-success mb-2" size={24} />
                  <h5 className="fw-bold text-success">Ready to Start</h5>
                  <p className="mb-1 fs-5 fw-semibold">{selectedVideo.title}</p>
                  <small className="text-muted">
                    {selectedVideo.description || "Get ready to learn!"}
                  </small>
                </div>
              )}

              <h3
                className="fw-bold text-center mb-4"
                style={{ color: "#3a86ff" }}
              >
                {series?.name?.toUpperCase() || "MODULE INTRODUCTION"}
              </h3>

              {/* Description */}
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
                    Welcome to this learning module! You'll explore amazing
                    content through engaging videos and interactive quizzes.
                  </p>
                )}
              </div>

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

                <Button
                  onClick={handleContinue}
                  className="d-flex align-items-center px-5 py-2"
                  style={{
                    background: selectedVideo
                      ? "linear-gradient(135deg, #ff1493, #3a86ff)"
                      : "#6c757d",
                    border: "none",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  disabled={!selectedVideo}
                >
                  {selectedVideo ? "Start Learning" : "Select Video First"}
                  <FaPlay className="ms-2" />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ModuleIntroduction;
