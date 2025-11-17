import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


const VideoSeries = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [seriesInfo, setSeriesInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const videosData = await getVideosBySeriesApi(seriesId);

        if (videosData.length > 0) {
          // Get series info from first video
          setSeriesInfo({
            title: videosData[0].series_title,
            description: videosData[0].series_description,
          });
        }

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        const formattedVideos = videosData.map((video, index) => ({
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail_url
            ? video.thumbnail_url.startsWith("http")
              ? video.thumbnail_url
              : video.thumbnail_url.startsWith("/")
                ? `${baseUrl}${video.thumbnail_url}`
                : `${baseUrl}/${video.thumbnail_url}`
            : "https://via.placeholder.com/300x200?text=No+Thumbnail",
          episodeNumber: index + 1,
          duration: video.duration || "10:00",
          isCompleted: false, // You can get this from user progress API
        }));

        setVideos(formattedVideos);
      } catch (err) {
        console.error("Videos API Error:", err);
        setError(err.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [seriesId]);

  const handleVideoClick = (videoId) => {
    navigate(`/child/series/${seriesId}/introduction/${videoId}`);
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading videos...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5">
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
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      {/* Series Header */}
      {seriesInfo && (
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
            {seriesInfo.title}
          </h1>
          <p
            className="text-muted lead mb-4"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            {seriesInfo.description}
          </p>
          <Badge bg="primary" className="fs-6 px-3 py-2">
            {videos.length} {videos.length === 1 ? "Episode" : "Episodes"}
          </Badge>
        </div>
      )}

      {/* Videos Grid */}
      <Row className="g-4 justify-content-center">
        {videos.map((video) => (
          <Col key={video.id} xs={12} md={10} lg={8}>
            <Card
              className="border-0"
              style={{
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              onClick={() => handleVideoClick(video.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <Row className="g-0">
                <Col md={4}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x140?text=No+Thumbnail";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.8)",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {video.duration}
                    </div>
                  </div>
                </Col>
                <Col md={8}>
                  <Card.Body className="d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="outline-primary" text="dark" className="fs-7">
                        Episode {video.episodeNumber}
                      </Badge>
                      {video.isCompleted && (
                        <Badge bg="success" className="fs-7">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <h5 className="fw-bold mb-2">{video.title}</h5>
                    <p
                      className="text-muted small flex-grow-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {video.description}
                    </p>
                    <div className="text-primary small fw-semibold mt-auto">
                      Start Learning →
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {videos.length === 0 && !loading && (
        <Alert variant="info" className="text-center">
          No videos available in this series.
        </Alert>
      )}
    </Container>
  );
};

export default VideoSeries;
