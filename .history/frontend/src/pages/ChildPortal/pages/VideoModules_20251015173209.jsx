import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getSeriesApi } from "../../../services/seriesApi"; // Changed to getSeriesApi

const VideoModules = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError(null);

        // FIXED: Use getSeriesApi instead of getVideosBySeriesApi
        const data = await getSeriesApi();
        console.log("Series API Response:", data);

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        const formattedSeries = data.map((seriesItem) => ({
          id: seriesItem.id,
          title: seriesItem.title || seriesItem.name || "Untitled Series",
          description:
            seriesItem.description ||
            seriesItem.series_description ||
            "No description available",
          thumbnail: seriesItem.thumbnail_url
            ? seriesItem.thumbnail_url.startsWith("http")
              ? seriesItem.thumbnail_url
              : seriesItem.thumbnail_url.startsWith("/")
                ? `${baseUrl}${seriesItem.thumbnail_url}`
                : `${baseUrl}/${seriesItem.thumbnail_url}`
            : "https://via.placeholder.com/300x200?text=No+Thumbnail",
          videoCount: seriesItem.video_count || 0,
        }));

        setSeries(formattedSeries);
      } catch (err) {
        console.error("Series API Error:", err);
        setError(err.message || "Failed to load series");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  const handleSeriesClick = (seriesId) => {
    navigate(`/child/series/${seriesId}`);
  };

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            size="lg"
          />
          <div className="mt-3">
            <p className="text-muted">Loading learning series...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5">
        <div className="text-center">
          <Alert
            variant="danger"
            className="mx-auto"
            style={{ maxWidth: "500px" }}
          >
            <h5>Error Loading Series</h5>
            <p>{error}</p>
            <Button
              variant="outline-danger"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button
              variant="primary"
              onClick={handleBackToDashboard}
              className="ms-2"
            >
              Back to Dashboard
            </Button>
          </Alert>
        </div>
      </Container>
    );
  }

  if (series.length === 0) {
    return (
      <Container fluid className="py-5">
        <div className="text-center">
          <Alert
            variant="info"
            className="mx-auto"
            style={{ maxWidth: "500px" }}
          >
            <h5>No Series Available</h5>
            <p>There are no learning series available at the moment.</p>
            <Button variant="primary" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="py-5"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      {/* Header Section */}
      <div className="text-center mb-5">
        <div className="mb-3">
          <Button
            variant="outline-primary"
            onClick={handleBackToDashboard}
            className="mb-3"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <h1 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
          Learning Series
        </h1>
        <p className="text-muted lead">
          Choose a series to start your learning journey
        </p>
        <Badge bg="primary" className="fs-6 px-3 py-2">
          {series.length} {series.length === 1 ? "Series" : "Series"} Available
        </Badge>
      </div>

      {/* Series Grid */}
      <Row className="g-4 justify-content-center">
        {series.map((seriesItem) => (
          <Col key={seriesItem.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              className="h-100 border-0"
              style={{
                cursor: "pointer",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "transform 0.25s, box-shadow 0.25s",
                background: "white",
              }}
              onClick={() => handleSeriesClick(seriesItem.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
              }}
            >
              {/* Thumbnail Section */}
              <div style={{ position: "relative" }}>
                <img
                  src={seriesItem.thumbnail}
                  alt={seriesItem.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200/667eea/ffffff?text=No+Thumbnail";
                    e.target.style.backgroundColor = "#667eea";
                  }}
                />
                {/* Video Count Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                  }}
                >
                  {seriesItem.videoCount}{" "}
                  {seriesItem.videoCount === 1 ? "video" : "videos"}
                </div>
              </div>

              {/* Card Body */}
              <Card.Body className="d-flex flex-column">
                <h5 className="fw-bold mb-2 text-dark">{seriesItem.title}</h5>
                <p
                  className="text-muted small flex-grow-1"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: "1.4",
                  }}
                >
                  {seriesItem.description}
                </p>

                {/* Action Section */}
                <div className="mt-auto pt-2">
                  <div className="text-primary small fw-semibold d-flex align-items-center justify-content-between">
                    <span>Start Learning</span>
                    <span>→</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Footer Stats */}
      <div className="text-center mt-5">
        <div className="text-muted">
          <small>
            Showing {series.length} of {series.length} series
          </small>
        </div>
      </div>
    </Container>
  );
};

export default VideoModules;
