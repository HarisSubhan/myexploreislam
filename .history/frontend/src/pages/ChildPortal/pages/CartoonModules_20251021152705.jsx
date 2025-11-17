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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAllVideosApi } from "../../../services/videoApi";
import { getModuleApi } from "../../../services/moduleApi";
import { createSlug } from "../../../utils/slugify";
import { FaVideo, FaListUl, FaPlay } from "react-icons/fa";

const CartoonModules = () => {
  const navigate = useNavigate();
  const { type } = useParams(); // 'singles' or 'series'
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(type || "singles");
  const [singleVideos, setSingleVideos] = useState([]);
  const [seriesModules, setSeriesModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache
        const cached = localStorage.getItem("allContentCache");
        const cacheTimestamp = localStorage.getItem("allContentCacheTimestamp");
        const CACHE_DURATION = 5 * 60 * 1000;

        if (cached && cacheTimestamp) {
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          if (cacheAge < CACHE_DURATION) {
            const cachedData = JSON.parse(cached);
            setSingleVideos(cachedData.singleVideos || []);
            setSeriesModules(cachedData.seriesModules || []);
            setLoading(false);
            return;
          }
        }

        // Fetch all videos and modules
        const [videosData, modulesData] = await Promise.all([
          getAllVideosApi(),
          getModuleApi(),
        ]);

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        // Process Single Videos
        const singleVideosData = videosData
          .filter((video) => video.series_id === null)
          .map((item) => ({
            id: item.id,
            title: item.title || "Untitled Video",
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
            slug: createSlug(item.title || `video-${item.id}`),
          }));

        // Process Series Modules
       // In the series processing part, replace with this:
const seriesModulesData = modulesData.map((module) => {
  const seriesVideos = videosData.filter(
    (video) => video.series_id === module.id
  );
  
  return {
    id: module.id,
    title: module.name || module.title || `Module ${module.id}`,
    description: module.description || "Explore learning content",
    thumbnail: module.thumbnail_url
      ? // ... thumbnail logic
      : "https://via.placeholder.com/300x200?text=No+Thumbnail",
    videoCount: seriesVideos.length,
    type: seriesVideos.length > 0 ? "series" : "single", // Dynamic type
    slug: createSlug(module.name || module.title || `module-${module.id}`),
    videos: seriesVideos,
  };
}).filter(module => module.videoCount > 0); // Only show modules with videos

        setSingleVideos(singleVideosData);
        setSeriesModules(seriesModulesData);

        // Cache data
        const cacheData = {
          singleVideos: singleVideosData,
          seriesModules: seriesModulesData,
          timestamp: Date.now(),
        };
        localStorage.setItem("allContentCache", JSON.stringify(cacheData));
        localStorage.setItem("allContentCacheTimestamp", Date.now().toString());
      } catch (err) {
        console.error("Content API Error:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/child/browse/${tab}`);
  };

  // Handle video/module click
  const handleItemClick = (item) => {
    if (item.type === "single") {
      // Direct video play with slug
      navigate(`/child/browse/singles/${item.slug}`);
    } else {
      // Navigate to series page
      navigate(`/child/series/${item.slug}`);
    }
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate("/child");
  };

  const clearCache = () => {
    localStorage.removeItem("allContentCache");
    localStorage.removeItem("allContentCacheTimestamp");
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
          {item.type === "series" && (
            <Badge bg="dark" className="position-absolute bottom-0 start-0 m-2">
              {item.videoCount} {item.videoCount === 1 ? "video" : "videos"}
            </Badge>
          )}

          {/* Play Button Overlay */}
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="bg-primary rounded-circle p-3 opacity-75">
              <FaPlay className="text-white" />
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
            Browse Content
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
                  <h5>No single videos available</h5>
                  <p>Check back later for new content</p>
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
                  <h5>No series available</h5>
                  <p>Check back later for new series content</p>
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
            {activeTab === "singles" ? "single videos" : "series"} • Total:{" "}
            {singleVideos.length + seriesModules.length} items
          </small>
        </div>
      )}
    </Container>
  );
};

export default CartoonModules;
