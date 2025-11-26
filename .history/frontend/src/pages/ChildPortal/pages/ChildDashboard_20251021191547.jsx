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

        // DEBUG: Check what API returns
        console.log("🎯 API Response:", data);
        console.log("📊 Data Type:", typeof data);
        console.log("🔍 Is Array?", Array.isArray(data));
        console.log("📈 Data Length:", data?.length);

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.log("❌ No modules data found");
          setModules([]);
          return;
        }

        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        const formattedModules = data.map((module, index) => {
          console.log(`📦 Module ${index}:`, module);

          // Better type detection
          const name = module.name || module.title || `Module ${module.id}`;
          const isSeries =
            name.toLowerCase().includes("series") ||
            module.type === "series" ||
            module.video_count > 1 ||
            (module.videos && module.videos.length > 1);

          const thumbnail = module.thumbnail_url
            ? module.thumbnail_url.startsWith("http")
              ? module.thumbnail_url
              : `${baseUrl}${module.thumbnail_url.startsWith("/") ? "" : "/"}${module.thumbnail_url}`
            : null;

          return {
            id: module.id,
            title: name,
            description: module.description || "Explore learning content",
            thumbnail,
            type: isSeries ? "series" : "single",
            videoCount: module.video_count || module.videos?.length || 0,
            seriesId: module.series_id,
            videos: module.videos || [],
            slug: createSlug(name),
            // Add raw module for debugging
            _raw: module,
          };
        });

        console.log("✅ Final Modules:", formattedModules);
        setModules(formattedModules);
      } catch (err) {
        console.error("❌ Error fetching modules:", err);
        const errorMessage = err.message || "Failed to load learning modules";
        setError(errorMessage);

        if (
          err.message?.includes("401") ||
          err.message?.includes("unauthorized")
        ) {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // const handleCardClick = (module) => {
  //   console.log("🖱️ Module clicked:", module);

  //   const moduleSlug = createSlug(module.title);

  //   if (module.type === "series") {
  //     console.log("🎬 Navigating to series:", moduleSlug);
  //     navigate(`/child/series/${moduleSlug}`);
  //   } else {
  //     console.log("🎥 Navigating to single video");
  //     navigate(`/child/browse/singles`, {
  //       state: {
  //         moduleId: module.id,
  //         moduleName: module.title,
  //       },
  //     });
  //   }
  // };

  const handleCardClick = (module) => {
    console.log("🖱️ Module clicked:", module);

    if (module.type === "series") {
      const moduleSlug = createSlug(module.title);
      navigate(`/child/series/${moduleSlug}`);
    } else {
      // Direct module flow start karein
      navigate(`/child/module/single/${module.id}/introduction`, {
        state: {
          moduleData: module,
        },
      });
    }
  };

  // const handleCardClick = (module) => {
  //   console.log("🖱️ Module clicked:", module);

  //   if (module.type === "series") {
  //     // Series ke liye series detail page pe jaye
  //     const moduleSlug = createSlug(module.title);
  //     navigate(`/child/series/${moduleSlug}`);
  //   } else {
  //     // Single module ke liye DIRECT module introduction pe jaye
  //     console.log("🚀 Navigating to module introduction for single video");
  //     navigate(`/child/module/single/${module.id}/introduction`, {
  //       state: {
  //         moduleData: module,
  //       },
  //     });
  //   }
  // };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Loading State
  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
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
            <p className="text-muted">Loading your learning modules...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Unauthorized State
  if (unauthorized) {
    return (
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          className="p-5 rounded-3"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            maxWidth: "500px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div className="mb-4">
            <FaSignInAlt size={50} className="text-danger mb-3" />
            <h3 className="text-danger mb-3">Session Expired</h3>
            <p className="text-muted mb-4">
              Your session has expired or you need to login to access your
              learning content.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleLoginRedirect}
            size="lg"
            className="w-100"
          >
            Go to Login
          </Button>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        }}
      >
        <div
          className="alert alert-danger text-center mx-auto p-4 rounded-3"
          style={{
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.95)",
            border: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <h5 className="alert-heading mb-3">Oops! Something went wrong</h5>
          <p className="mb-4">{error}</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button variant="outline-danger" onClick={handleRetry}>
              Try Again
            </Button>
            <Button variant="primary" onClick={handleLoginRedirect}>
              Go to Login
            </Button>
          </div>
        </div>
      </Container>
    );
  }

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

      {/* Debug Info - Remove after testing */}
      {modules.length > 0 && (
        <Alert
          variant="info"
          className="mb-4 mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <h6>🔍 Debug Information</h6>
          <div className="row">
            <div className="col-md-4">
              <strong>Total Modules:</strong> {modules.length}
            </div>
            <div className="col-md-4">
              <strong>Series:</strong>{" "}
              {modules.filter((m) => m.type === "series").length}
            </div>
            <div className="col-md-4">
              <strong>Single Videos:</strong>{" "}
              {modules.filter((m) => m.type === "single").length}
            </div>
          </div>
          <details className="mt-2">
            <summary>View Module Details</summary>
            <pre
              className="mt-2 p-2 bg-dark text-white rounded"
              style={{ fontSize: "12px", maxHeight: "200px", overflow: "auto" }}
            >
              {JSON.stringify(modules, null, 2)}
            </pre>
          </details>
        </Alert>
      )}

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
                      {module.type === "series" ? "View Series" : "Watch Now"} →
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
              📊 {modules.length} {modules.length === 1 ? "module" : "modules"}{" "}
              • {modules.filter((m) => m.type === "series").length} series •{" "}
              {modules.filter((m) => m.type === "single").length} single videos
            </small>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ChildDashboard;
