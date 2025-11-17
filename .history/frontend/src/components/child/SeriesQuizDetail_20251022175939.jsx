import React, { useEffect, useState } from "react";
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
import {
  FaArrowLeft,
  FaPlay,
  FaListUl,
  FaClock,
  FaVideo,
} from "react-icons/fa";
import { baseUrl } from "../../services/config";
import { getVideosBySeriesApi, getAllVideosApi } from "../../services/videoApi";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";

const SeriesQuizDetail = () => {
  const { seriesSlug } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Build correct thumbnail URL
  const buildThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) return null;
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

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Series Slug:", seriesSlug);

        // Get all series to find the matching one
        const allSeries = await getSeriesApi();
        console.log("All series:", allSeries);

        // Find series by slug match
        const foundSeries = allSeries.find((series) => {
          const seriesSlugFromName = createSlug(series.name || series.title);
          return seriesSlugFromName === seriesSlug;
        });

        console.log("Found series:", foundSeries);

        if (!foundSeries) {
          setError("Series not found");
          setLoading(false);
          return;
        }

        // Add proper thumbnail URL to series
        const seriesWithThumbnail = {
          ...foundSeries,
          thumbnail_url: buildThumbnailUrl(foundSeries.thumbnail_url),
        };
        setSeries(seriesWithThumbnail);

        // Now fetch videos for this series
        try {
          console.log("Fetching videos for series ID:", foundSeries.id);
          const seriesVideos = await getVideosBySeriesApi(foundSeries.id);
          console.log("Videos from series API:", seriesVideos);

          let processedVideos = [];

          if (seriesVideos && seriesVideos.length > 0) {
            // Process videos to ensure proper thumbnail URLs
            processedVideos = seriesVideos.map((video) => ({
              ...video,
              thumbnail_url: buildThumbnailUrl(video.thumbnail_url),
              video_url: buildVideoUrl(video.video_url),
            }));
          } else {
            // Alternative: get all videos and filter by series_id
            const allVideos = await getAllVideosApi();
            const filteredVideos = allVideos.filter(
              (video) => video.series_id == foundSeries.id
            );
            console.log("Filtered videos:", filteredVideos);

            // Process videos to ensure proper thumbnail URLs
            processedVideos = filteredVideos.map((video) => ({
              ...video,
              thumbnail_url: buildThumbnailUrl(video.thumbnail_url),
              video_url: buildVideoUrl(video.video_url),
            }));
          }

          if (processedVideos.length > 0) {
            setVideos(processedVideos);
          } else {
            setError("No videos available in this series");
          }
        } catch (videoError) {
          console.error("Video fetch error:", videoError);
          // Fallback: get all videos and filter
          const allVideos = await getAllVideosApi();
          const filteredVideos = allVideos.filter(
            (video) => video.series_id == foundSeries.id
          );

          // Process videos to ensure proper thumbnail URLs
          const processedVideos = filteredVideos.map((video) => ({
            ...video,
            thumbnail_url: buildThumbnailUrl(video.thumbnail_url),
            video_url: buildVideoUrl(video.video_url),
          }));

          if (processedVideos.length > 0) {
            setVideos(processedVideos);
          } else {
            setError("No videos available in this series");
          }
        }
      } catch (err) {
        console.error("Series fetch error:", err);
        setError("Failed to load series data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesSlug]);

  // In SeriesQuizDetail component - Fix handleVideoClick for specific episodes
  const handleVideoClick = (video) => {
    console.log("🎬 Starting specific episode:", video.title);

    // ✅ For specific episodes, go DIRECTLY to the video page
    // navigate(`/child/module/${seriesSlug}/page1/${video.id}`, {
    navigate(`/child/module/${seriesSlug}/introduction`, {
      state: {
        currentVideo: video,
        seriesData: series,
        videoId: video.id,
        seriesSlug: seriesSlug,
      },
      replace: false,
    });
  };

  // Keep handleStartSeries for introduction
  const handleStartSeries = () => {
    console.log("🎬 Starting series from beginning:", series.name);

    if (videos.length > 0) {
      const firstVideo = videos[0];
      navigate(`/child/module/${seriesSlug}/introduction`, {
        state: {
          currentVideo: firstVideo,
          seriesData: series,
          videoId: firstVideo.id,
          seriesSlug: seriesSlug,
        },
      });
    } else {
      console.error("❌ No videos available in this series");
    }
  };

  const handleBackToBrowse = () => {
    navigate("/child/browse/series");
  };

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  const formatDuration = (duration) => {
    if (!duration) return "Unknown";
    if (typeof duration === "number") {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return duration;
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <div className="mt-3">
            <p className="text-muted">Loading series content...</p>
          </div>
        </div>
      </Container>
    );
  }

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
              Back to Series
            </Button>
            <Button variant="outline-primary" onClick={handleBackToDashboard}>
              Dashboard
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ maxWidth: "1200px" }}>
      {/* Navigation */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-secondary"
              onClick={handleBackToBrowse}
              className="d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" />
              Back to Series
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

      {/* Series Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-start gap-4">
            {series?.thumbnail_url ? (
              <img
                src={series.thumbnail_url}
                alt={series.title}
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/200x150?text=No+Thumbnail";
                }}
              />
            ) : (
              <div
                style={{
                  width: "200px",
                  height: "150px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6c757d",
                  border: "2px dashed #dee2e6",
                }}
              >
                No Thumbnail
              </div>
            )}
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-3 mb-2">
                <h1 className="fw-bold mb-0">
                  {series?.name || series?.title || `Series ${series?.id}`}
                </h1>
                <Badge bg="primary" className="fs-6">
                  <FaListUl className="me-1" />
                  Series
                </Badge>
              </div>
              <p className="text-muted mb-3">
                {series?.description || "Explore this learning series"}
              </p>
              <div className="d-flex align-items-center gap-4">
                <span className="text-muted">
                  {videos.length} {videos.length === 1 ? "episode" : "episodes"}
                </span>
                {series?.video_count && (
                  <span className="text-muted">
                    Total: {series.video_count} videos
                  </span>
                )}
                {/* Start Series Button */}
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleStartSeries}
                  className="d-flex align-items-center"
                >
                  <FaPlay className="me-2" />
                  Start Series
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Episodes List */}
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              <FaVideo className="me-2" />
              Series Episodes ({videos.length})
            </h4>
            <Badge bg="info" className="fs-6">
              Click on any episode to start learning
            </Badge>
          </div>

          {videos.length > 0 ? (
            <Row className="g-4">
              {videos.map((video, index) => (
                <Col xs={12} md={6} lg={4} key={video.id}>
                  <Card
                    className="h-100 border-0 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          video.thumbnail_url ||
                          "https://via.placeholder.com/300x180?text=No+Thumbnail"
                        }
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x180?text=No+Thumbnail";
                        }}
                      />
                      <div className="position-absolute bottom-0 end-0 m-2">
                        <Badge bg="dark">
                          <FaClock className="me-1" />
                          {formatDuration(video.duration)}
                        </Badge>
                      </div>
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge bg="primary">Episode {index + 1}</Badge>
                      </div>
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="bg-primary rounded-circle p-2 opacity-75">
                          <FaPlay className="text-white" />
                        </div>
                      </div>
                    </div>
                    <Card.Body>
                      <h6 className="fw-bold">{video.title}</h6>
                      <p className="text-muted small mb-2">
                        {video.description || "No description available"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Click to start learning
                        </small>
                        <Button variant="outline-primary" size="sm">
                          Start
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="text-center">
              <FaListUl size={32} className="mb-2" />
              <h5>No Episodes Available</h5>
              <p>This series doesn't have any episodes yet.</p>
              <Button variant="primary" onClick={handleBackToBrowse}>
                Browse Other Series
              </Button>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SeriesQuizDetail;
