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
import { getAssignedContentApi } from "../../../services/parentApi";
import { createSlug } from "../../../utils/slugify";

const VideoModules = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [singleVideos, setSingleVideos] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Capitalize first word of title
  const capitalizeFirstWord = (title) => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  useEffect(() => {
    const fetchAssignedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get child ID from localStorage or user data
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const childId = userData.id || userData.childId;
        
        if (!childId) {
          setError("Child ID not found. Please login again.");
          setLoading(false);
          return;
        }

        console.log("Fetching assigned content for child:", childId);
        
        // Fetch assigned content for the child
        const response = await getAssignedContentApi(childId);
        console.log("API Response:", response);
        
        // Handle different response formats
        let assignedContent = [];
        
        if (Array.isArray(response)) {
          // If response is directly an array
          assignedContent = response;
        } else if (response && Array.isArray(response.data)) {
          // If response has data array
          assignedContent = response.data;
        } else if (response && response.data && Array.isArray(response.data.content)) {
          // If response has data.content array
          assignedContent = response.data.content;
        } else if (response && response.content && Array.isArray(response.content)) {
          // If response has content array
          assignedContent = response.content;
        } else {
          console.warn("Unexpected API response format:", response);
          assignedContent = [];
        }

        console.log("Processed assigned content:", assignedContent);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        // Process assigned content into singles and series
        const formattedSingleVideos = [];
        const formattedSeries = [];

        assignedContent.forEach((item) => {
          // Debug log each item
          console.log("Processing item:", item);

          if (item.contentType === 'video' || item.type === 'single' || item.video_id) {
            // Single video
            formattedSingleVideos.push({
              id: item.contentId || item.id || item.video_id,
              title: capitalizeFirstWord(item.title || item.name || "Untitled Video"),
              description: item.description || "Watch this video",
              thumbnail: item.thumbnail_url || item.thumbnail
                ? (item.thumbnail_url || item.thumbnail).startsWith("http")
                  ? (item.thumbnail_url || item.thumbnail)
                  : (item.thumbnail_url || item.thumbnail).startsWith("/")
                    ? `${baseUrl}${item.thumbnail_url || item.thumbnail}`
                    : `${baseUrl}/${item.thumbnail_url || item.thumbnail}`
                : "https://via.placeholder.com/300x200?text=No+Thumbnail",
              videoCount: 1,
              type: "single",
              slug: createSlug(item.title || item.name || `video-${item.contentId || item.id || item.video_id}`),
              created_at: item.created_at,
              progress: item.progress || 0,
              video_url: item.video_url || item.videoUrl,
            });
          } else if (item.contentType === 'series' || item.type === 'series' || item.series_id) {
            // Series
            formattedSeries.push({
              id: item.contentId || item.id || item.series_id,
              title: capitalizeFirstWord(item.title || item.name || `Series ${item.contentId || item.id || item.series_id}`),
              description: item.description || "Explore this learning series",
              thumbnail: item.thumbnail_url || item.thumbnail || "https://via.placeholder.com/300x200?text=Series",
              videoCount: item.video_count || item.videos?.length || 0,
              type: "series",
              slug: createSlug(item.title || item.name || `series-${item.contentId || item.id || item.series_id}`),
              created_at: item.created_at,
              progress: item.progress || 0,
              videos: item.videos || [],
            });
          } else {
            console.warn("Unknown content type:", item);
          }
        });

        console.log("Single videos:", formattedSingleVideos);
        console.log("Series modules:", formattedSeries);

        setSeries(formattedSeries);
        setSingleVideos(formattedSingleVideos);
        setAllContent([...formattedSeries, ...formattedSingleVideos]);

      } catch (err) {
        console.error("Error fetching assigned content:", err);
        setError("Failed to load assigned content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedContent();
  }, []);

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  const handleModuleClick = (item) => {
    if (item.type === "series") {
      navigate(`/child/module/${item.slug}`);
    } else {
      navigate(`/child/module/single/${item.id}/introduction`, {
        state: {
          currentVideo: item,
          videoId: item.id,
          isSingleVideo: true,
        },
      });
    }
  };

  const handleViewDetails = (item, e) => {
    e.stopPropagation();

    if (item.type === "series") {
      navigate(`/child/series/${item.slug}`);
    } else {
      navigate(`/child/browse/singles/${item.slug}`);
    }
  };

  const refreshContent = () => {
    window.location.reload();
  };

  // Filter content based on active tab
  const getFilteredContent = () => {
    const content =
      activeTab === "series"
        ? series
        : activeTab === "singles"
          ? singleVideos
          : allContent;

    switch (activeTab) {
      case "in-progress":
        return content.filter(
          (item) => item.progress > 0 && item.progress < 100
        );
      case "completed":
        return content.filter((item) => item.progress === 100);
      case "new":
        return content
          .filter((item) => item.created_at)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return content;
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

  // Render content card
  const renderContentCard = (item) => (
    <Col xs={12} sm={6} md={4} lg={3} key={`${item.type}-${item.id}`}>
      <Card
        className="h-100 border-0"
        style={{
          cursor: "pointer",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          transition: "transform 0.25s, box-shadow 0.25s",
        }}
        onClick={() => handleModuleClick(item)}
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
            src={item.thumbnail}
            alt={item.title}
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
          <Badge
            bg={item.type === "series" ? "primary" : "success"}
            className="position-absolute top-0 start-0 m-2"
          >
            {item.type === "series" ? (
              <>
                <FaListUl className="me-1" /> Series
              </>
            ) : (
              <>
                <FaVideo className="me-1" /> Single
              </>
            )}
          </Badge>

          {/* Video Count Badge */}
          {item.videoCount > 0 && (
            <Badge bg="dark" className="position-absolute top-0 end-0 m-2">
              {item.videoCount} {item.videoCount === 1 ? "video" : "videos"}
            </Badge>
          )}

          {/* Progress Badge */}
          <Badge
            bg={getProgressColor(item.progress)}
            className="position-absolute bottom-0 start-0 m-2"
          >
            {getProgressText(item.progress)}
          </Badge>
        </div>

        <Card.Body className="d-flex flex-column">
          <h6 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>
            {item.title}
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
            {item.description}
          </p>

          <div className="mt-auto d-flex gap-2">
            <Button
              variant={item.progress === 0 ? "primary" : "outline-primary"}
              size="sm"
              className="flex-grow-1"
              onClick={() => handleModuleClick(item)}
            >
              {item.type === "series"
                ? "View Series"
                : item.progress === 0
                  ? "Start Learning"
                  : item.progress === 100
                    ? "Review"
                    : "Continue"}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={(e) => handleViewDetails(item, e)}
              title={`View ${item.type === "series" ? "Series" : "Video"} Details`}
            >
              <FaListUl />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  const filteredContent = getFilteredContent();

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
            My Assigned Learning Modules
          </h2>
        </div>
        <Button
          onClick={refreshContent}
          variant="outline-secondary"
          size="sm"
          title="Refresh content"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
          <Button
            onClick={() => window.location.reload()}
            variant="outline-danger"
            size="sm"
            className="ms-3"
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Welcome Message */}
      {!loading && !error && (
        <div className="alert alert-info mb-4">
          <h6 className="alert-heading">Welcome to your assigned content! 🎉</h6>
          <p className="mb-0">
            Here you'll find all the videos and series that have been assigned to you by your parent. 
            {allContent.length === 0 && 
              " No content has been assigned yet. Please ask your parent to assign some learning content for you."
            }
          </p>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {!loading && (
        <div className="alert alert-light mb-4">
          <h6 className="alert-heading">Content Status</h6>
          <p className="mb-1">
            Series: {series.length} | Single Videos: {singleVideos.length} | Total: {allContent.length}
          </p>
          <small className="text-muted">
            Showing only content assigned to you by your parent.
          </small>
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
              All Content
              {!loading && (
                <Badge bg="primary" className="ms-2">
                  {allContent.length}
                </Badge>
              )}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading
              ? renderSkeleton(8)
              : filteredContent.map(renderContentCard)}
            {!loading && filteredContent.length === 0 && (
              <Col xs={12} className="text-center py-5">
                <div className="text-muted">
                  <FaListUl size={48} className="mb-3" />
                  <h5>No assigned content available</h5>
                  <p>Your parent hasn't assigned any learning content yet</p>
                </div>
              </Col>
            )}
          </Row>
        </Tab>

        <Tab
          eventKey="series"
          title={
            <span>
              <FaListUl className="me-2" />
              Series Only
              {!loading && (
                <Badge bg="info" className="ms-2">
                  {series.length}
                </Badge>
              )}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading
              ? renderSkeleton(8)
              : filteredContent.map(renderContentCard)}
            {!loading && filteredContent.length === 0 && (
              <Col xs={12} className="text-center py-5">
                <div className="text-muted">
                  <FaListUl size={48} className="mb-3" />
                  <h5>No series assigned</h5>
                  <p>Your parent hasn't assigned any series yet</p>
                </div>
              </Col>
            )}
          </Row>
        </Tab>

        <Tab
          eventKey="singles"
          title={
            <span>
              <FaVideo className="me-2" />
              Single Videos
              {!loading && (
                <Badge bg="success" className="ms-2">
                  {singleVideos.length}
                </Badge>
              )}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading
              ? renderSkeleton(8)
              : filteredContent.map(renderContentCard)}
            {!loading && filteredContent.length === 0 && (
              <Col xs={12} className="text-center py-5">
                <div className="text-muted">
                  <FaVideo size={48} className="mb-3" />
                  <h5>No single videos assigned</h5>
                  <p>Your parent hasn't assigned any single videos yet</p>
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
            Showing {filteredContent.length} of {allContent.length} assigned items •
            {series.length} series • {singleVideos.length} single videos
          </small>
        </div>
      )}
    </Container>
  );
};

export default VideoModules;