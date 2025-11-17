import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaPlay, FaVideo } from "react-icons/fa";
import { getVideoByIdApi, getAllVideosApi } from "../../services/videoApi";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";
import { baseUrl } from "../../services/config";

const ModulePage1 = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams();
  const location = useLocation();

  const [videoData, setVideoData] = useState(null);
  const [seriesData, setSeriesData] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ✅ Data initialize karein
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        console.log("📍 ModulePage1 - Location State:", location.state);

        // ✅ Pehle state se data lein
        if (location.state?.videoData) {
          setVideoData(location.state.videoData);
          setSelectedVideo(location.state.videoData);
        }

        if (location.state?.seriesData) {
          setSeriesData(location.state.seriesData);
        }

        // ✅ Agar series data nahi hai, to fetch karein
        if (!location.state?.seriesData && seriesSlug) {
          console.log("🎬 Fetching series data for slug:", seriesSlug);
          const allSeries = await getSeriesApi();
          const foundSeries = allSeries.find((series) => {
            const seriesSlugFromName = createSlug(series.name || series.title);
            return seriesSlugFromName === seriesSlug;
          });
          if (foundSeries) {
            setSeriesData(foundSeries);

            // ✅ Series ke saare videos fetch karein
            try {
              const videos = await getAllVideosApi();
              const seriesVideos = videos.filter(
                (video) => video.series_id == foundSeries.id
              );
              setAllVideos(seriesVideos);
              console.log("🎥 Series Videos:", seriesVideos);

              // ✅ Agar koi specific video selected nahi hai, to pehla video select karein
              if (!location.state?.videoData && seriesVideos.length > 0) {
                setSelectedVideo(seriesVideos[0]);
                setVideoData(seriesVideos[0]);
              }
            } catch (videoErr) {
              console.error("❌ Error fetching videos:", videoErr);
            }
          }
        }

        // ✅ Agar video data nahi hai, to fetch karein
        if (!location.state?.videoData && location.state?.videoId) {
          console.log("📹 Fetching video data for ID:", location.state.videoId);
          const video = await getVideoByIdApi(location.state.videoId);
          setVideoData(video);
          setSelectedVideo(video);
        }
      } catch (err) {
        console.error("❌ Error initializing data:", err);
        setError("Failed to load practice activity");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.state, seriesSlug]);

  // Build correct thumbnail URL
  const buildThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl)
      return "https://via.placeholder.com/300x180?text=No+Thumbnail";
    if (thumbnailUrl.startsWith("http")) return thumbnailUrl;
    if (thumbnailUrl.startsWith("/")) return `${baseUrl}${thumbnailUrl}`;
    return `${baseUrl}/${thumbnailUrl}`;
  };

  // Build correct video URL
  const buildVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;
    if (videoUrl.startsWith("http")) return videoUrl;
    if (videoUrl.startsWith("/")) return `${baseUrl}${videoUrl}`;
    return `${baseUrl}/${videoUrl}`;
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setVideoData(video);
  };

  const handleWatchVideo = () => {
    if (selectedVideo?.video_url) {
      const videoUrl = buildVideoUrl(selectedVideo.video_url);
      window.open(videoUrl, "_blank");
    }
  };

  const handleNext = () => {
    navigate(`/child/module/${seriesSlug}/quiz`, {
      state: {
        videoData: selectedVideo,
        seriesData: seriesData,
        ...location.state,
      },
    });
  };

  const handleBack = () => {
    navigate(`/child/module/${seriesSlug}/introduction`, {
      state: {
        videoData: selectedVideo,
        seriesData: seriesData,
        ...location.state,
      },
    });
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
          <p className="mt-2">Loading practice activity...</p>
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
          <h5>Error Loading Activity</h5>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
      {/* Debug Info */}
      <Alert variant="info" className="text-center">
        <h4>🔍 ModulePage1 - Video Content</h4>
        <p>
          Series: <strong>{seriesData?.name || "Unknown Series"}</strong>
        </p>
        <p>
          Selected Video:{" "}
          <strong>{selectedVideo?.title || "No video selected"}</strong>
        </p>
        <p>
          Total Videos: <strong>{allVideos.length}</strong>
        </p>
      </Alert>

      {/* Main Content */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        {seriesData?.name
          ? `${seriesData.name.toUpperCase()} - PRACTICE`
          : "PRACTICE ACTIVITY"}
      </h4>

      {/* Selected Video Display */}
      {selectedVideo && (
        <Card
          className="mb-4 border-0 shadow-sm mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <Card.Body className="p-4">
            <div className="text-center mb-3">
              <h5 style={{ color: "#ff1493" }}>
                <FaVideo className="me-2" />
                {selectedVideo.title}
              </h5>
              <p className="text-muted">
                {selectedVideo.description || "No description available"}
              </p>
            </div>

            {/* Video Thumbnail */}
            <div className="text-center position-relative">
              <img
                src={buildThumbnailUrl(selectedVideo.thumbnail_url)}
                alt={selectedVideo.title}
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: selectedVideo.video_url ? "pointer" : "default",
                  border: "3px solid #3a86ff",
                }}
                onClick={handleWatchVideo}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x300/667eea/ffffff?text=Video+Thumbnail";
                }}
              />

              {/* Play Button Overlay */}
              {selectedVideo.video_url && (
                <div
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{ cursor: "pointer" }}
                  onClick={handleWatchVideo}
                >
                  <div
                    className="bg-primary rounded-circle p-3"
                    style={{
                      opacity: 0.8,
                      transition: "all 0.3s",
                      transform: "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.2)";
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.opacity = "0.8";
                    }}
                  >
                    <FaPlay className="text-white" size={24} />
                  </div>
                </div>
              )}
            </div>

            {/* Watch Video Button */}
            {selectedVideo.video_url && (
              <div className="text-center mt-3">
                <Button
                  variant="primary"
                  onClick={handleWatchVideo}
                  className="d-flex align-items-center mx-auto"
                  size="lg"
                >
                  <FaPlay className="me-2" />
                  Watch This Video
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* All Videos List */}
      {allVideos.length > 0 && (
        <Card
          className="mb-4 border-0 shadow-sm mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <FaVideo className="me-2" />
              All Videos in this Series ({allVideos.length})
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {allVideos.map((video, index) => (
                <Col xs={12} md={6} key={video.id}>
                  <Card
                    className={`h-100 border-0 shadow-sm ${selectedVideo?.id === video.id ? "border-primary" : ""}`}
                    style={{
                      cursor: "pointer",
                      border:
                        selectedVideo?.id === video.id
                          ? "3px solid #3a86ff"
                          : "1px solid #dee2e6",
                    }}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="d-flex">
                      <img
                        src={buildThumbnailUrl(video.thumbnail_url)}
                        alt={video.title}
                        style={{
                          width: "80px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x60/667eea/ffffff?text=Video";
                        }}
                      />
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1" style={{ fontSize: "0.9rem" }}>
                          {video.title}
                        </h6>
                        <small className="text-muted">
                          Episode {index + 1}
                        </small>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Activity Instructions */}
      <Card
        className="mb-4 border-0 shadow-sm mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Body className="p-4">
          <h6 className="fw-bold mb-3">📝 Practice Activity Instructions:</h6>
          <ul className="mb-0">
            <li>Watch the selected video carefully</li>
            <li>Take notes of key concepts and ideas</li>
            <li>Think about how you can apply this knowledge</li>
            <li>Prepare for the quiz in the next step</li>
            <li>
              You can select different videos from the series using the list
              above
            </li>
          </ul>
        </Card.Body>
      </Card>

      {/* Navigation Buttons */}
      <div
        className="d-flex justify-content-between mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Button
          variant="secondary"
          onClick={handleBack}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "10px 20px",
          }}
        >
          <FaArrowLeft className="me-2" />
          BACK TO INTRODUCTION
        </Button>

        <Button
          variant="primary"
          onClick={handleNext}
          style={{
            background: "linear-gradient(135deg, #ff1493 0%, #3a86ff 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "10px 20px",
          }}
        >
          CONTINUE TO QUIZ
          <FaArrowRight className="ms-2" />
        </Button>
      </div>
    </Container>
  );
};

export default ModulePage1;
