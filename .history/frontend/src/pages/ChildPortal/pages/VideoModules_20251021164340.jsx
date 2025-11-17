import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Tabs,
  Tab,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaListUl, FaPlay, FaArrowLeft } from "react-icons/fa";
import { getSeriesApi } from "../../../services/seriesApi";
import { createSlug } from "../../../utils/slugify";

const VideoModules = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all", "popular", "new"

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSeriesApi();
        console.log("Series API Response:", data);

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        const formattedSeries = data.map((seriesItem) => ({
          id: seriesItem.id,
          title:
            seriesItem.name || seriesItem.title || `Series ${seriesItem.id}`,
          description: seriesItem.description || "Explore this learning series",
          thumbnail: seriesItem.thumbnail_url
            ? seriesItem.thumbnail_url.startsWith("http")
              ? seriesItem.thumbnail_url
              : seriesItem.thumbnail_url.startsWith("/")
                ? `${baseUrl}${seriesItem.thumbnail_url}`
                : `${baseUrl}/${seriesItem.thumbnail_url}`
            : "https://via.placeholder.com/300x200?text=No+Thumbnail",
          videoCount: seriesItem.video_count || 0,
          type: "series",
          slug: createSlug(
            seriesItem.name || seriesItem.title || `series-${seriesItem.id}`
          ),
          created_at: seriesItem.created_at,
        }));

        setSeries(formattedSeries);
      } catch (err) {
        console.error("Series API Error:", err);
        setError("Failed to load series. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  const handleSeriesClick = (seriesItem) => {
    navigate(`/child/series/${seriesItem.slug}`);
  };

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  const clearCache = () => {
    window.location.reload();
  };

  // Filter series based on active tab
  const getFilteredSeries = () => {
    switch (activeTab) {
      case "popular":
        return series
          .filter((s) => s.videoCount > 0)
          .sort((a, b) => b.videoCount - a.videoCount);
      case "new":
        return series
          .filter((s) => s.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return series;
    }
  };

  // Render loading skeleton
  const renderSkeleton = (count) => {
    return Array(count)
      .fill({})
      .map((_, index) => (
        <Col xs={12} sm={6} md={4} lg={3} key={index}>
          <Card className="h-100 border-0" style={{ borderRadius: "20px" }}>
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#f8f9fa",
                borderRadius: "20px 20px 0 0",
              }}
            />
            <Card.Body>
              <div
                style={{
                  width: "80%",
                  height: "20px",
                  backgroundColor: "#f8f9fa",
                  marginBottom: "8px",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  width: "60%",
                  height: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      ));
  };

  // Render series card
  const renderSeriesCard = (seriesItem) => (
    <Col xs={12} sm={6} md={4} lg={3} key={seriesItem.id}>
      <Card
        className="h-100 border-0"
        style={{
          cursor: "pointer",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          transition: "transform 0.25s, box-shadow 0.25s",
        }}
        onClick={() => handleSeriesClick(seriesItem)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.18)";
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
              backgroundColor: "#f8f9fa",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Thumbnail";
              e.target.style.backgroundColor = "#f8f9fa";
            }}
          />

          {/* Type Badge */}
          <Badge bg="primary" className="position-absolute top-0 end-0 m-2">
            <FaListUl className="me-1" /> Series
          </Badge>

          {/* Video Count Badge */}
          {seriesItem.videoCount > 0 && (
            <Badge bg="dark" className="position-absolute bottom-0 start-0 m-2">
              {seriesItem.videoCount}{" "}
              {seriesItem.videoCount === 1 ? "video" : "videos"}
            </Badge>
          )}

          {/* Play Button Overlay */}
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{ opacity: 0.8 }}
          >
            <div className="bg-dark rounded-circle p-2">
              <FaPlay className="text-white" size={16} />
            </div>
          </div>
        </div>

        <Card.Body className="d-flex flex-column">
          <h6 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>
            {seriesItem.title}
          </h6>
          <p
            className="small text-muted flex-grow-1"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {seriesItem.description}
          </p>

          <Button variant="outline-primary" size="sm" className="mt-auto">
            View Series
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

  const filteredSeries = getFilteredSeries();

  return (
    <Container fluid className="py-4" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button
            variant="outline-secondary"
            onClick={handleBackToDashboard}
            className="me-3"
          >
            <FaArrowLeft className="me-2" />
            Back to Dashboard
          </Button>
          <h2 className="fw-bold d-inline-block" style={{ color: "#0d6efd" }}>
            Learning Series
          </h2>
        </div>
        <Button
          onClick={clearCache}
          variant="outline-secondary"
          size="sm"
          title="Clear cache and reload"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger text-center">
          {error}
          <Button
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-outline-danger ms-3"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
        fill
      >
        <Tab
          eventKey="all"
          title={
            <span>
              <FaListUl className="me-2" />
              All Series
              {!loading && (
                <Badge bg="primary" className="ms-2">
                  {series.length}
                </Badge>
              )}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading ? renderSkeleton(8) : filteredSeries.map(renderSeriesCard)}

            {!loading && filteredSeries.length === 0 && (
              <Col xs={12} className="text-center py-5">
                <div className="text-muted">
                  <FaListUl size={48} className="mb-3" />
                  <h5>No series available</h5>
                  <p>Check back later for new learning series</p>
                </div>
              </Col>
            )}
          </Row>
        </Tab>

        <Tab
          eventKey="popular"
          title={
            <span>
              <FaPlay className="me-2" />
              Popular
              {!loading && (
                <Badge bg="success" className="ms-2">
                  {series.filter((s) => s.videoCount > 0).length}
                </Badge>
              )}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading ? renderSkeleton(8) : filteredSeries.map(renderSeriesCard)}

            {!loading && filteredSeries.length === 0 && (
              <Col xs={12} className="text-center py-5">
                <div className="text-muted">
                  <FaPlay size={48} className="mb-3" />
                  <h5>No popular series</h5>
                  <p>Series with videos will appear here</p>
                </div>
              </Col>
            )}
          </Row>
        </Tab>

        <Tab
          eventKey="new"
          title={
            <span>
              <FaVideo className="me-2" />
              New
              {!loading && (
                <Badge bg="info" className="ms-2">
                  {series.filter((s) => s.created_at).length}
                </Badge>
              )}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading ? renderSkeleton(8) : filteredSeries.map(renderSeriesCard)}

            {!loading && filteredSeries.length === 0 && (
              <Col xs={12} className="text-center py-5">
                <div className="text-muted">
                  <FaVideo size={48} className="mb-3" />
                  <h5>No new series</h5>
                  <p>Recently added series will appear here</p>
                </div>
              </Col>
            )}
          </Row>
        </Tab>
      </Tabs>

      {/* Stats */}
      {!loading && !error && (
        <div className="text-center mt-5 pt-4 border-top">
          <small className="text-muted">
            Showing {filteredSeries.length} of {series.length} series • Total
            videos:{" "}
            {series.reduce((total, s) => total + (s.videoCount || 0), 0)}
          </small>
        </div>
      )}
    </Container>
  );
};

export default VideoModules;
