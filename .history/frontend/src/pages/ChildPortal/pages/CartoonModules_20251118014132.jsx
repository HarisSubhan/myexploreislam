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
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAssignedContentApi } from "../../../services/parentApi";
import { createSlug } from "../../../utils/slugify";
import { FaVideo, FaListUl, FaPlay } from "react-icons/fa";

const CartoonModules = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [activeTab, setActiveTab] = useState(type || "singles");
  const [singleVideos, setSingleVideos] = useState([]);
  const [seriesModules, setSeriesModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Fetch assigned content for the child
        const assignedContent = await getAssignedContentApi(childId);
        
        // Process assigned content into singles and series
        const singleVideosData = [];
        const seriesModulesData = [];

        assignedContent.forEach((item) => {
          const baseUrl = import.meta.env.VITE_API_BASE_URL;

          if (item.contentType === 'video' || item.type === 'single') {
            // Single video
            singleVideosData.push({
              id: item.contentId || item.id,
              title: capitalizeFirstWord(item.title || "Untitled Video"),
              description: item.description || "No description available",
              thumbnail: item.thumbnail_url
                ? item.thumbnail_url.startsWith("http")
                  ? item.thumbnail_url
                  : item.thumbnail_url.startsWith("/")
                    ? `${baseUrl}${item.thumbnail_url}`
                    : `${baseUrl}/${item.thumbnail_url}`
                : "https://via.placeholder.com/300x200?text=No+Thumbnail",
              videoUrl: item.video_url,
              type: "single",
              slug: createSlug(item.title || `video-${item.contentId || item.id}`),
            });
          } else if (item.contentType === 'series' || item.type === 'series') {
            // Series
            seriesModulesData.push({
              id: item.contentId || item.id,
              title: capitalizeFirstWord(item.title || `Series ${item.contentId || item.id}`),
              description: item.description || "Explore learning series",
              thumbnail: item.thumbnail_url || "https://via.placeholder.com/300x200?text=Series",
              videoCount: item.video_count || item.videos?.length || 0,
              type: "series",
              slug: createSlug(item.title || `series-${item.contentId || item.id}`),
              videos: item.videos || [],
            });
          }
        });

        setSingleVideos(singleVideosData);
        setSeriesModules(seriesModulesData);

      } catch (err) {
        setError("Failed to load assigned content. Please try again.");
        console.error("Error fetching assigned content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedContent();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/child/browse/${tab}`);
  };

  const handleItemClick = (item) => {
    if (item.type === "single") {
      navigate(`/child/browse/singles/${item.slug}`);
    } else {
      navigate(`/child/series/${item.slug}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  const refreshContent = () => {
    window.location.reload();
  };

  // Render loading skeleton
  const renderSkeleton = (count) => {
    return Array(count)
      .fill({})
      .map((_, index) => (
        <Col xs={12} sm={6} md={4} lg={3} key={index}>
          <Card className="h-100 border-0" style={{ borderRadius: "20px" }}>
            <Skeleton height={200} />
            <Card.Body>
              <Skeleton width={`80%`} height={20} className="mb-1" />
              <Skeleton width={`60%`} height={15} />
            </Card.Body>
          </Card>
        </Col>
      ));
  };

  // Render video/module card
  const renderCard = (item) => (
    <Col xs={12} sm={6} md={4} lg={3} key={item.id}>
      <Card
        className="h-100 border-0"
        style={{
          cursor: "pointer",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          transition: "transform 0.25s, box-shadow 0.25s",
        }}
        onClick={() => handleItemClick(item)}
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
            className="position-absolute top-0 end-0 m-2"
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

          {/* Video Count for Series */}
          {item.type === "series" && item.videoCount > 0 && (
            <Badge bg="dark" className="position-absolute bottom-0 start-0 m-2">
              {item.videoCount} {item.videoCount === 1 ? "video" : "videos"}
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

          <Button
            variant={
              item.type === "series" ? "outline-primary" : "outline-success"
            }
            size="sm"
            className="mt-auto"
          >
            {item.type === "series" ? "View Series" : "Watch Now"}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

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
            ← Back to Dashboard
          </Button>
          <h2 className="fw-bold d-inline-block" style={{ color: "#0d6efd" }}>
            My Assigned Content
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

      {/* Welcome Message */}
      {!loading && !error && (
        <div className="alert alert-info mb-4">
          <h6 className="alert-heading">Welcome to your learning content! 🎉</h6>
          <p className="mb-0">
            Here you'll find all the videos and series that have been assigned to you. 
            {singleVideos.length === 0 && seriesModules.length === 0 && 
              " No content has been assigned yet. Please ask your parent to assign some content for you."
            }
          </p>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={handleTabChange}
        className="mb-4"
        fill
      >
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
            {loading ? renderSkeleton(8) : singleVideos.map(renderCard)}

            {!loading && singleVideos.length === 0 && (
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

        <Tab
          eventKey="series"
          title={
            <span>
              <FaListUl className="me-2" />
              Series
              {!loading && (
                <Badge bg="primary" className="ms-2">
                  {seriesModules.length}
                </Badge>
              )}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading ? renderSkeleton(8) : seriesModules.map(renderCard)}

            {!loading && seriesModules.length === 0 && (
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
      </Tabs>

      {/* Stats */}
      {!loading && !error && (
        <div className="text-center mt-5 pt-4 border-top">
          <small className="text-muted">
            Showing{" "}
            {activeTab === "singles"
              ? singleVideos.length
              : seriesModules.length}{" "}
            {activeTab === "singles" ? "single videos" : "series"} • Total Assigned:{" "}
            {singleVideos.length + seriesModules.length} items
          </small>
        </div>
      )}
    </Container>
  );
};

export default CartoonModules;