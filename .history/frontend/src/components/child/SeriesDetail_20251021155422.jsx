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
import { FaArrowLeft, FaPlay, FaListUl, FaClock } from "react-icons/fa";
import { getSeriesVideosApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";

const SeriesDetail = () => {
  const { seriesSlug } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract series ID from slug
        const seriesId = extractIdFromSlug(seriesSlug);

        if (!seriesId) {
          setError("Invalid series URL");
          setLoading(false);
          return;
        }

        // Fetch series videos
        const seriesData = await getSeriesVideosApi(seriesId);
        console.log("Series API Response:", seriesData);

        setSeries({
          id: seriesData.id,
          title: seriesData.name || seriesData.title,
          description: seriesData.description,
          thumbnail: seriesData.thumbnail_url,
        });

        // Set videos from series data
        if (seriesData.videos && seriesData.videos.length > 0) {
          setVideos(seriesData.videos);
        } else {
          setError("No videos available in this series");
        }
      } catch (err) {
        console.error("Series fetch error:", err);
        setError("Failed to load series data");
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesSlug]);

  const extractIdFromSlug = (slug) => {
    if (!slug) return null;
    const idMatch = slug.match(/^(\d+)-/);
    return idMatch ? idMatch[1] : null;
  };

  // In SeriesDetail.jsx - Update handleVideoClick function
  const handleVideoClick = (video) => {
    const videoSlug = createSlug(video.title) || `video-${video.id}`;
    navigate(`/child/series/${seriesSlug}/video/${videoSlug}`, {
      state: {
        videoData: video,
        seriesData: series,
      },
    });
  };

  const handleBackToBrowse = () => {
    navigate("/child/browse/series");
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
          <Button variant="primary" onClick={handleBackToBrowse}>
            Back to Series
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ maxWidth: "1200px" }}>
      {/* Navigation */}
      <Row className="mb-4">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={handleBackToBrowse}
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Back to Series
          </Button>
        </Col>
      </Row>

      {/* Series Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-start gap-4">
            {series?.thumbnail && (
              <img
                src={series.thumbnail}
                alt={series.title}
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            )}
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-3 mb-2">
                <h1 className="fw-bold mb-0">{series?.title}</h1>
                <Badge bg="primary" className="fs-6">
                  <FaListUl className="me-1" />
                  Series
                </Badge>
              </div>
              <p className="text-muted mb-3">{series?.description}</p>
              <div className="d-flex align-items-center gap-4">
                <span className="text-muted">
                  {videos.length} {videos.length === 1 ? "video" : "videos"}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Videos List */}
      <Row>
        <Col>
          <h4 className="mb-4">Series Videos</h4>
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
                        src={video.thumbnail_url || "/assets/images/book.png"}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="position-absolute bottom-0 end-0 m-2">
                        <Badge bg="dark">
                          <FaClock className="me-1" />
                          {formatDuration(video.duration)}
                        </Badge>
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
                          Episode {index + 1}
                        </small>
                        <Button variant="outline-primary" size="sm">
                          Watch
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
              <h5>No Videos Available</h5>
              <p>This series doesn't have any videos yet.</p>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SeriesDetail;
