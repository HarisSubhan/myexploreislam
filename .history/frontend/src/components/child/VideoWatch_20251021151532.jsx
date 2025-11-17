import React, { useState, useEffect, useRef } from "react";
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
import { FaArrowLeft, FaPlay, FaVideo, FaClock, FaRedo } from "react-icons/fa";
import { baseUrl } from "../../services/config";
import { getAllVideosApi } from "../../services/videoApi";
import { dashboardApi } from "../../services/childActivity";
import { createSlug } from "../../utils/slugify";


const VideoWatch = () => {
  const { moduleSlug, videoSlug } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

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
      const video = videos.find((video) => video.id.toString() === videoId);
      if (video) return video;
    }

    // Find by slug match with video title
    const videoByTitle = videos.find(
      (video) => createSlug(video.title) === slug
    );
    if (videoByTitle) return videoByTitle;

    // If still not found, return first video (fallback)
    return videos.length > 0 ? videos[0] : null;
  };

  // Build correct video URL
  const buildVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;

    // If URL is already absolute
    if (videoUrl.startsWith("http")) {
      return videoUrl;
    }

    // If URL starts with slash
    if (videoUrl.startsWith("/")) {
      return `${baseUrl}${videoUrl}`;
    }

    // If URL doesn't start with slash
    return `${baseUrl}/${videoUrl}`;
  };

  // Build thumbnail URL
  const buildThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) return null;

    if (thumbnailUrl.startsWith("http")) {
      return thumbnailUrl;
    }

    if (thumbnailUrl.startsWith("/")) {
      return `${baseUrl}${thumbnailUrl}`;
    }

    return `${baseUrl}/${thumbnailUrl}`;
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);
        setVideoError(null);

        console.log("Fetching video data...");
        console.log("moduleSlug:", moduleSlug);
        console.log("videoSlug:", videoSlug);

        // Get all videos
        const allVideos = await getAllVideosApi();
        console.log("All videos fetched:", allVideos.length);

        let videoData = null;

        // Find current video based on available parameters
        if (videoSlug) {
          videoData = findVideoBySlug(allVideos, videoSlug);
        } else if (moduleSlug) {
          videoData = findVideoBySlug(allVideos, moduleSlug);
        }

        console.log("Found video data:", videoData);

        if (videoData) {
          setCurrentVideo(videoData);
          await logVideoWatch(videoData);
        } else {
          setError("Video not found. Please check the URL.");
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
  }, [moduleSlug, videoSlug, retryCount]);

  // Video event handlers
  const handleVideoLoadStart = () => {
    setVideoLoading(true);
    setVideoError(null);
  };

  const handleVideoCanPlay = () => {
    setVideoLoading(false);
    setVideoError(null);
  };

  const handleVideoError = (e) => {
    console.error("Video error:", e);
    setVideoLoading(false);
    setVideoError(
      "Failed to load video. The video file may be corrupted or unavailable."
    );

    // Try to play anyway
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
      }
    }, 2000);
  };

  const handleVideoEnded = () => {
    console.log("Video ended");
  };

  const handleRetryVideo = () => {
    setRetryCount((prev) => prev + 1);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((e) => {
        console.error("Play failed:", e);
      });
    }
  };

  const handleRecommendedClick = async (video) => {
    try {
      await logVideoWatch(video);

      const videoSlug =
        createSlug(video.title) || `${video.id}-${createSlug(video.title)}`;
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

  const videoUrl = buildVideoUrl(currentVideo.video_url);
  const thumbnailUrl = buildThumbnailUrl(currentVideo.thumbnail_url);

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
              {videoUrl ? (
                <div style={{ position: "relative" }}>
                  <video
                    ref={videoRef}
                    controls
                    width="100%"
                    height="450"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#000",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    }}
                    poster={thumbnailUrl}
                    autoPlay
                    muted // Start with muted to avoid autoplay restrictions
                    onLoadStart={handleVideoLoadStart}
                    onCanPlay={handleVideoCanPlay}
                    onError={handleVideoError}
                    onEnded={handleVideoEnded}
                    playsInline // Important for mobile
                    preload="auto"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                    <track kind="captions" />
                  </video>

                  {videoLoading && (
                    <div
                      className="position-absolute top-50 start-50 translate-middle"
                      style={{ zIndex: 10 }}
                    >
                      <Spinner animation="border" variant="light" />
                      <div className="text-white mt-2">Loading video...</div>
                    </div>
                  )}

                  {videoError && (
                    <div
                      className="position-absolute top-50 start-50 translate-middle text-center"
                      style={{ zIndex: 10 }}
                    >
                      <Alert variant="warning" className="mb-3">
                        <h6>Video Playback Error</h6>
                        <p className="mb-2">{videoError}</p>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={handleRetryVideo}
                          className="d-flex align-items-center mx-auto"
                        >
                          <FaRedo className="me-2" />
                          Retry Playback
                        </Button>
                      </Alert>
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
                  <Alert variant="warning" className="text-center">
                    <h6>Video URL Not Available</h6>
                    <p className="mb-0">
                      The video file URL is missing or invalid.
                    </p>
                    <p className="mb-0">
                      Video URL: {currentVideo.video_url || "Not provided"}
                    </p>
                  </Alert>
                </div>
              )}
            </div>

            {/* Debug Information (Remove in production) */}
            {process.env.NODE_ENV === "development" && (
              <Card className="border-warning mb-4">
                <Card.Header className="bg-warning text-dark">
                  <h6 className="mb-0">Debug Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <strong>Video URL:</strong>
                      <div className="text-break small">
                        {currentVideo.video_url}
                      </div>
                    </Col>
                    <Col md={6}>
                      <strong>Built URL:</strong>
                      <div className="text-break small">{videoUrl}</div>
                    </Col>
                    <Col md={6} className="mt-2">
                      <strong>Base URL:</strong>
                      <div className="small">{baseUrl}</div>
                    </Col>
                    <Col md={6} className="mt-2">
                      <strong>Video ID:</strong>
                      <div className="small">{currentVideo.id}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

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
                    >
                      <Row className="g-0 align-items-center">
                        <Col xs={4}>
                          <div
                            style={{
                              backgroundImage: `url(${buildThumbnailUrl(video.thumbnail_url) || "/assets/images/book.png"})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              width: "100%",
                              height: "80px",
                              borderRadius: "6px 0 0 6px",
                            }}
                          />
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
                            <Badge
                              bg="outline-primary"
                              text="dark"
                              className="fs-7"
                            >
                              Single
                            </Badge>
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
    </Container>
  );
};

export default VideoWatch;
