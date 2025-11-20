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
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaListUl, FaArrowLeft } from "react-icons/fa";
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

  const capitalizeFirstWord = (title) => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const getImageUrl = (thumbnail, baseUrl) => {
    if (!thumbnail) return "https://via.placeholder.com/300x200?text=No+Thumbnail";
    
    if (thumbnail.startsWith("http")) return thumbnail;
    if (thumbnail.startsWith("/")) return `${baseUrl}${thumbnail}`;
    
    return `${baseUrl}/${thumbnail}`;
  };

  useEffect(() => {
    const fetchAssignedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const childId = userData.id || userData.childId;
        
        if (!childId) {
          setError("Child ID not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await getAssignedContentApi(childId);
        
        let assignedContent = [];
        
        if (response?.data && Array.isArray(response.data)) {
          assignedContent = response.data;
        } else if (Array.isArray(response)) {
          assignedContent = response;
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        const formattedSingleVideos = [];
        const formattedSeries = [];

        assignedContent.forEach((item) => {
          if (item.video_id && item.video_title) {
            formattedSingleVideos.push({
              id: item.video_id,
              title: capitalizeFirstWord(item.video_title || "Untitled Video"),
              description: "Watch this video",
              thumbnail: getImageUrl(item.video_thumbnail, baseUrl),
              type: "single",
              slug: createSlug(item.video_title || `video-${item.video_id}`),
            });
          }

          if (item.series_id && item.series_title) {
            formattedSeries.push({
              id: item.series_id,
              title: capitalizeFirstWord(item.series_title || `Series ${item.series_id}`),
              description: "Explore this learning series",
              thumbnail: getImageUrl(item.series_thumbnail, baseUrl),
              type: "series",
              slug: createSlug(item.series_title || `series-${item.series_id}`),
            });
          }
        });

        setSeries(formattedSeries);
        setSingleVideos(formattedSingleVideos);
        setAllContent([...formattedSeries, ...formattedSingleVideos]);

      } catch (err) {
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

  const getFilteredContent = () => {
    switch (activeTab) {
      case "series":
        return series;
      case "singles":
        return singleVideos;
      default:
        return allContent;
    }
  };

  const renderSkeleton = (count) => {
    return Array(count)
      .fill(0)
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
              e.target.src = "https://via.placeholder.com/300x200?text=No+Thumbnail";
            }}
          />

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
            variant="primary"
            size="sm"
            onClick={() => handleModuleClick(item)}
          >
            {item.type === "series" ? "View Series" : "Watch Now"}
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

  const filteredContent = getFilteredContent();

  return (
    <Container fluid className="py-4" style={{ minHeight: "100vh" }}>
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
              {!loading && <Badge bg="primary" className="ms-2">{allContent.length}</Badge>}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading ? renderSkeleton(8) : filteredContent.map(renderContentCard)}
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
              {!loading && <Badge bg="info" className="ms-2">{series.length}</Badge>}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading ? renderSkeleton(8) : filteredContent.map(renderContentCard)}
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
              {!loading && <Badge bg="success" className="ms-2">{singleVideos.length}</Badge>}
            </span>
          }
        >
          <Row className="g-4 justify-content-center mt-3">
            {loading ? renderSkeleton(8) : filteredContent.map(renderContentCard)}
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