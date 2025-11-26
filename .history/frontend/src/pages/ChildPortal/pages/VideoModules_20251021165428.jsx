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
import {
  FaVideo,
  FaListUl,
  FaPlay,
  FaArrowLeft,
  FaBook,
  FaGraduationCap,
  FaTrophy,
} from "react-icons/fa";
import { getSeriesApi } from "../../../services/seriesApi";
import { createSlug } from "../../../utils/slugify";

const VideoModules = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

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
          progress: seriesItem.progress || 0, // Add progress if available from API
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

  // Navigate to series introduction (first step)
  const handleSeriesClick = (seriesItem) => {
    // Navigate to the series introduction page
    navigate(`/child/module/series/${seriesItem.id}/introduction`);
  };

  // Navigate to series detail page (alternative navigation)
  const handleViewSeries = (seriesItem, e) => {
    e.stopPropagation(); // Prevent card click
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
      case "in-progress":
        return series.filter((s) => s.progress > 0 && s.progress < 100);
      case "completed":
        return series.filter((s) => s.progress === 100);
      case "new":
        return series
          .filter((s) => s.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return series;
    }
  };

  // Get progress badge color
  const getProgressColor = (progress) => {
    if (progress === 0) return "secondary";
    if (progress < 50) return "warning";
    if (progress < 100) return "info";
    return "success";
  };

  // Get progress text
  const getProgressText = (progress) => {
    if (progress === 0) return "Not Started";
    if (progress === 100) return "Completed";
    return `${progress}% Complete`;
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

          {/* Progress Badge */}
          <Badge
            bg={getProgressColor(seriesItem.progress)}
            className="position-absolute top-0 start-0 m-2"
          >
            {getProgressText(seriesItem.progress)}
          </Badge>

          {/* Video Count Badge */}
          {seriesItem.videoCount > 0 && (
            <Badge bg="dark" className="position-absolute top-0 end-0 m-2">
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

          {/* Action Buttons */}
          <div className="mt-auto d-flex gap-2">
            <Button
              variant={
                seriesItem.progress === 0 ? "primary" : "outline-primary"
              }
              size="sm"
              className="flex-grow-1"
              onClick={(e) => handleSeriesClick(seriesItem)}
            >
              {seriesItem.progress === 0
                ? "Start Learning"
                : seriesItem.progress === 100
                  ? "Review"
                  : "Continue"}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={(e) => handleViewSeries(seriesItem, e)}
              title="View Series Details"
            >
              <FaListUl />
            </Button>
          </div>

          {/* Progress Bar */}
          {seriesItem.progress > 0 && (
            <div className="mt-2">
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className={`progress-bar bg-${getProgressColor(seriesItem.progress)}`}
                  style={{ width: `${seriesItem.progress}%` }}
                ></div>
              </div>
            </div>
          )}
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
          eventKey="in-progress"
          title={
            <span>
              <FaBook className="me-2" />
              In Progress
              {!loading && (
                <Badge bg="warning" className="ms-2">
                  {
                    series.filter((s) => s.progress > 0 && s.progress < 100)
                      .length
                  }
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
                  <FaBook size={48} className="mb-3" />
                  <h5>No series in progress</h5>
                  <p>Start a series to see it here</p>
                </div>
              </Col>
            )}
          </Row>
        </Tab>

        <Tab
          eventKey="completed"
          title={
            <span>
              <FaTrophy className="me-2" />
              Completed
              {!loading && (
                <Badge bg="success" className="ms-2">
                  {series.filter((s) => s.progress === 100).length}
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
                  <FaTrophy size={48} className="mb-3" />
                  <h5>No completed series</h5>
                  <p>Complete a series to see it here</p>
                </div>
              </Col>
            )}
          </Row>
        </Tab>

        <Tab
          eventKey="new"
          title={
            <span>
              <FaGraduationCap className="me-2" />
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
                  <FaGraduationCap size={48} className="mb-3" />
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
            {series.reduce((total, s) => total + (s.videoCount || 0), 0)} •
            Completed: {series.filter((s) => s.progress === 100).length} • In
            Progress:{" "}
            {series.filter((s) => s.progress > 0 && s.progress < 100).length}
          </small>
        </div>
      )}
    </Container>
  );
};

export default VideoModules;
