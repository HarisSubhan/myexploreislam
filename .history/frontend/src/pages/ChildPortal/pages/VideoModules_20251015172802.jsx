import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getVideosBySeriesApi } from "../../../services/videoApi";



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

        const data = await getVideosBySeriesApi();
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

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading series...</span>
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

  if (series.length === 0) {
    return (
      <Container fluid className="py-5">
        <Alert variant="info" className="text-center">
          No series available at the moment.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ minHeight: "100vh" }}>
      <h2 className="text-center fw-bold mb-5" style={{ color: "#0d6efd" }}>
        Learning Series
      </h2>

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
                      "https://via.placeholder.com/300x200?text=No+Thumbnail";
                  }}
                />
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
                  }}
                >
                  {seriesItem.videoCount} videos
                </div>
              </div>

              <Card.Body>
                <h5 className="fw-bold mb-2">{seriesItem.title}</h5>
                <p
                  className="text-muted small"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {seriesItem.description}
                </p>
                <div className="text-primary small fw-semibold">
                  Start Learning →
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VideoModules;
