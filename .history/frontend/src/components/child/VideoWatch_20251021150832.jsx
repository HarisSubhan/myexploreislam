import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay, FaVideo, FaClock } from "react-icons/fa";
import { baseUrl } from "../../services/config";
import { getAllVideosApi, getVideoByIdApi } from "../../services/videoApi";
import { dashboardApi } from "../../services/childActivity";
import { createSlug } from "../../../utils/slugify";

const VideoWatch = () => {
  const { moduleSlug, videoSlug } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);

  // Get child ID from localStorage
  const getChildId = () => {
    const childData = localStorage.getItem("currentChild");
    if (childData) {
      const child = JSON.parse(childData);
      return child.id;
    }
    return 1;
  };

  // Log video watch activity
  const logVideoWatch = async (video) => {
    try {
      const childId = getChildId();
      await dashboardApi.logVideoWatch(childId, video.id, video.title);
      console.log("Video watch logged successfully");
    } catch (error) {
      console.error("Failed to log video watch:", error);
    }
  };

  // Extract video ID from slug or find video by slug
  const findVideoBySlug = (videos, slug) => {
    if (!slug) return null;

    // Try to extract ID from slug (format: "123-video-title")
    const idMatch = slug.match(/^(\d+)-/);
    if (idMatch) {
      const videoId = idMatch[1];
      return videos.find((video) => video.id.toString() === videoId);
    }

    // Find by slug match with video title
    return videos.find((video) => createSlug(video.title) === slug);
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all videos
        const allVideos = await getAllVideosApi();

        let videoData = null;

        // Find current video based on available parameters
        if (videoSlug) {
          videoData = findVideoBySlug(allVideos, videoSlug);
        } else if (moduleSlug) {
          videoData = findVideoBySlug(allVideos, moduleSlug);
        }

        if (videoData) {
          setCurrentVideo(videoData);
          await logVideoWatch(videoData);
        } else {
          setError("Video not found");
          setLoading(false);
          return;
        }

        // Get recommended videos (other single videos)
        const singleVideos = allVideos.filter(
          (video) => video.series_id === null
        );

        const filteredVideos = singleVideos.filter(
          (video) => video.id !== videoData.id
        );

        // Sort by creation date and take first 6
        const sortedVideos = filteredVideos
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6);

        setRecommendedVideos(sortedVideos);
      } catch (err) {
        console.error("Video fetch error:", err);
        setError(err.message || "Failed to load video data");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [moduleSlug, videoSlug]);

  const handleRecommendedClick = async (video) => {
    try {
      await logVideoWatch(video);

      const videoSlug = createSlug(video.title) || `video-${video.id}`;
      navigate(`/child/browse/singles/${videoSlug}`);
    } catch (error) {
      console.error("Failed to log recommended video watch:", error);
    }
  };

  const handleBackToBrowse = () => {
    navigate("/child/browse/singles");
  };

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getVideoDuration = (duration) => {
    if (!duration) return "Unknown";
    if (typeof duration === "number") {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return duration;
  };

  // Loading State
  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            size="lg"
          />
          <div className="mt-3">
            <p className="text-muted">Loading video content...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Error State
  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="text-center">
          <h5>Oops! Something went wrong</h5>
          <p className="mb-3">{error}</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button
              variant="outline-danger"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button variant="primary" onClick={handleBackToBrowse}>
              Back to Videos
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!currentVideo) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning" className="text-center">
          <h5>Video Not Found</h5>
          <p>The requested video could not be found.</p>
          <Button variant="primary" onClick={handleBackToBrowse}>
            Back to Videos
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ maxWidth: "1400px" }}>
      {/* Navigation Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-secondary"
              onClick={handleBackToBrowse}
              className="d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" />
              Back to Videos
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleBackToDashboard}
              className="d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" />
              Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Main Video Player Section */}
        <Col lg={8}>
          <div className="video-player-section">
            {/* Video Player */}
            <div className="video-player-wrapper mb-4">
              {currentVideo.video_url ? (
                <div style={{ position: "relative" }}>
                  <video
                    controls
                    width="100%"
                    height="450"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#000",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    }}
                    poster={
                      currentVideo.thumbnail_url
                        ? `${baseUrl}${currentVideo.thumbnail_url}`
                        : ""
                    }
                    autoPlay
                    onLoadStart={() => setVideoLoading(true)}
                    onCanPlay={() => setVideoLoading(false)}
                    onError={() => setVideoLoading(false)}
                  >
                    <source
                      src={`${baseUrl}${currentVideo.video_url}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>

                  {videoLoading && (
                    <div
                      className="position-absolute top-50 start-50 translate-middle"
                      style={{ zIndex: 10 }}
                    >
                      <Spinner animation="border" variant="light" />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    width: "100%",
                    height: "450px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    border: "2px dashed #dee2e6",
                  }}
                >
                  <FaVideo size={64} className="text-muted mb-3" />
                  <Alert variant="warning" className="text-center m-0">
                    <h6>Video Not Available</h6>
                    <p className="mb-0">
                      The video file is currently unavailable.
                    </p>
                  </Alert>
                </div>
              )}
            </div>

            {/* Video Information */}
            <div className="video-info-section">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <h3 className="fw-bold mb-0">{currentVideo.title}</h3>
                    <Badge bg="success" className="fs-6">
                      <FaVideo className="me-1" />
                      Single Video
                    </Badge>
                  </div>

                  <div className="d-flex align-items-center gap-4 text-muted">
                    {currentVideo.duration && (
                      <span className="d-flex align-items-center">
                        <FaClock className="me-1" />
                        {getVideoDuration(currentVideo.duration)}
                      </span>
                    )}
                    {currentVideo.created_at && (
                      <span>
                        Uploaded: {formatDate(currentVideo.created_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Description */}
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="card-title mb-3">Description</h5>
                  {currentVideo.description ? (
                    <div
                      className="video-description"
                      style={{
                        whiteSpace: "pre-line",
                        lineHeight: "1.6",
                        color: "#495057",
                      }}
                    >
                      {currentVideo.description}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">
                      No description available for this video.
                    </p>
                  )}
                </Card.Body>
              </Card>

              {/* Additional Video Metadata */}
              <Row className="mt-4">
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Video Details
                      </h6>
                      <div className="small">
                        <div>
                          <strong>Type:</strong> Single Video
                        </div>
                        <div>
                          <strong>Category:</strong>{" "}
                          {currentVideo.category || "General"}
                        </div>
                        {currentVideo.difficulty_level && (
                          <div>
                            <strong>Level:</strong>{" "}
                            {currentVideo.difficulty_level}
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Technical Info
                      </h6>
                      <div className="small">
                        <div>
                          <strong>Format:</strong> MP4
                        </div>
                        <div>
                          <strong>Status:</strong>{" "}
                          {currentVideo.video_url ? "Available" : "Unavailable"}
                        </div>
                        <div>
                          <strong>Access:</strong> Free
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Recommended Videos Sidebar */}
        <Col lg={4}>
          <div className="recommended-sidebar">
            <Card
              className="border-0 shadow-sm sticky-top"
              style={{ top: "20px" }}
            >
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0 d-flex align-items-center">
                  <FaPlay className="me-2" />
                  Recommended Videos
                </h5>
              </Card.Header>
              <Card.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
                {recommendedVideos.length > 0 ? (
                  recommendedVideos.map((video) => (
                    <Card
                      key={video.id}
                      className="mb-3 border-0 shadow-sm-hover"
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => handleRecommendedClick(video)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                      }}
                    >
                      <Row className="g-0 align-items-center">
                        <Col xs={4}>
                          <div
                            style={{
                              backgroundImage: `url(${video.thumbnail_url ? `${baseUrl}${video.thumbnail_url}` : "/assets/images/book.png"})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              width: "100%",
                              height: "80px",
                              borderRadius: "6px 0 0 6px",
                              position: "relative",
                            }}
                          >
                            <div className="position-absolute top-50 start-50 translate-middle">
                              <div className="bg-dark bg-opacity-50 rounded-circle p-1">
                                <FaPlay className="text-white" size={12} />
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={8}>
                          <Card.Body style={{ padding: "12px" }}>
                            <h6
                              className="card-title mb-1"
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                lineHeight: "1.2",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {video.title}
                            </h6>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <Badge
                                bg="outline-primary"
                                text="dark"
                                className="fs-7"
                              >
                                Single
                              </Badge>
                              {video.duration && (
                                <small className="text-muted">
                                  {getVideoDuration(video.duration)}
                                </small>
                              )}
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <FaVideo className="text-muted mb-2" size={32} />
                    <p className="text-muted mb-0">
                      No recommended videos available
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Additional Actions */}
      <Row className="mt-5 pt-4 border-top">
        <Col className="text-center">
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="outline-primary"
              onClick={handleBackToBrowse}
              className="d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" />
              Back to All Videos
            </Button>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="d-flex align-items-center"
            >
              <FaPlay className="me-2" />
              Watch Again
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoWatch;
