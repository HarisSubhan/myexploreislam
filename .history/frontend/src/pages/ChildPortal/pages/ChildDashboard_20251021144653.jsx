import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaVideo, FaListUl } from "react-icons/fa";
import "../../../components/child/ChildProfilePage.css";
import { getModuleApi } from "../../../services/moduleApi";
import { createSlug } from "../../../utils/slugify";

const ChildDashboard = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        setUnauthorized(false);

        const data = await getModuleApi();

        if (!data || data.length === 0) {
          setModules([]);
          return;
        }

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        const formattedModules = data.map((module) => {
          const name = module.name || "";
          const isSeries = name.toLowerCase().includes("series");
          const moduleSlug = createSlug(name || `module-${module.id}`);

          const thumbnail = module.thumbnail_url
            ? module.thumbnail_url.startsWith("http")
              ? module.thumbnail_url
              : module.thumbnail_url.startsWith("/")
                ? `${baseUrl}${module.thumbnail_url}`
                : `${baseUrl}/${module.thumbnail_url}`
            : null;

          return {
            id: module.id,
            title: module.name || module.title || `Module ${module.id}`,
            description: module.description || "Explore learning content",
            thumbnail,
            type: isSeries ? "series" : "single",
            videoCount: module.video_count || 0,
            seriesId: module.series_id,
            slug: moduleSlug, // Add slug for URL
            videos: module.videos || [],
            metadata: module.metadata || {},
          };
        });

        setModules(formattedModules);
      } catch (err) {
        const errorMessage = err.message || "Failed to load learning modules";
        setError(errorMessage);

        if (
          err.message?.includes("401") ||
          err.message?.includes("unauthorized") ||
          err.message?.includes("authentication") ||
          err.message?.includes("token")
        ) {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Dynamic navigation with slug-based URLs
  const handleCardClick = (module) => {
    const moduleSlug = module.slug || createSlug(module.title);

    if (module.type === "series" && module.videos && module.videos.length > 0) {
      // URL: /child/series/maths-basic-series
      navigate(`/child/series/${moduleSlug}`);
    } else if (
      module.type === "single" &&
      module.videos &&
      module.videos.length > 0
    ) {
      // For single videos: /child/videos/english-grammar-lesson
      const firstVideo = module.videos[0];
      const videoSlug = createSlug(
        firstVideo.title || `video-${firstVideo.id}`
      );
      navigate(`/child/videos/${moduleSlug}/${videoSlug}`);
    } else {
      // Fallback: /child/modules/science-experiments
      navigate(`/child/modules/${moduleSlug}`);
    }
  };

  // Alternative approach with ID + Slug combination
  const handleCardClickWithId = (module) => {
    const moduleSlug = module.slug || createSlug(module.title);

    // URL format: /child/modules/123-maths-basic-series
    const urlSlug = `${module.id}-${moduleSlug}`;

    if (module.type === "series") {
      navigate(`/child/series/${urlSlug}`);
    } else {
      navigate(`/child/videos/${urlSlug}`);
    }
  };

  // Rest of the component remains same...
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Loading, Unauthorized, Error states remain same...

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center py-5"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-white mb-3 display-5">
          Welcome to Your Learning World!
        </h1>
        <p className="text-white-50 lead mb-0">
          Choose your learning path and start your journey
        </p>
      </div>

      {/* Modules Grid */}
      {modules.length > 0 ? (
        <Row className="g-4 justify-content-center">
          {modules.map((module) => (
            <Col key={module.id} xs={12} sm={8} md={6} lg={4} xl={3}>
              <Card
                onClick={() => handleCardClick(module)}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "none",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  background: "rgba(255, 255, 255, 0.95)",
                }}
                className="h-100 module-card"
              >
                {/* Thumbnail Section */}
                <div style={{ position: "relative" }}>
                  {module.thumbnail ? (
                    <img
                      src={module.thumbnail}
                      alt={module.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x180/667eea/ffffff?text=Learning+Module";
                        e.target.style.backgroundColor = "#667eea";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "180px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          module.type === "series"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        padding: "1rem",
                        textAlign: "center",
                      }}
                    >
                      {module.title}
                    </div>
                  )}

                  {/* Type Badge */}
                  <Badge
                    bg={module.type === "series" ? "primary" : "success"}
                    className="position-absolute top-0 end-0 m-3"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {module.type === "series" ? (
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
                  <Badge
                    bg="dark"
                    className="position-absolute bottom-0 start-0 m-3"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {module.videoCount > 0
                      ? `${module.videoCount} ${module.videoCount === 1 ? "video" : "videos"}`
                      : module.type === "series"
                        ? "Series"
                        : "Video"}
                  </Badge>
                </div>

                {/* Card Body */}
                <Card.Body className="d-flex flex-column">
                  <h5 className="fw-bold mb-2 text-dark">{module.title}</h5>
                  <p
                    className="text-muted small flex-grow-1"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {module.description}
                  </p>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <Button
                      variant={module.type === "series" ? "primary" : "success"}
                      size="sm"
                      className="w-100"
                      style={{
                        borderRadius: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {module.type === "series" ? "View Series" : "Watch Video"}{" "}
                      →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="warning" className="text-center">
          <h5>No Modules Found</h5>
          <p>
            There are no learning modules available. Please check back later.
          </p>
        </Alert>
      )}

      {/* Footer Stats */}
      {modules.length > 0 && (
        <div className="text-center mt-5">
          <div className="text-white-50">
            <small>
              {modules.length} {modules.length === 1 ? "module" : "modules"} •{" "}
              {modules.filter((m) => m.type === "series").length} series •{" "}
              {modules.filter((m) => m.type === "single").length} single videos
            </small>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ChildDashboard;
