import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { FaArrowLeft, FaPlay, FaListUl } from "react-icons/fa";
import { baseUrl } from "../../services/config";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";

const SeriesQuizDetail = () => {
  const { seriesSlug } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Build correct thumbnail URL
  const buildThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) return null;
    if (thumbnailUrl.startsWith("http")) return thumbnailUrl;
    if (thumbnailUrl.startsWith("/")) return `${baseUrl}${thumbnailUrl}`;
    return `${baseUrl}/${thumbnailUrl}`;
  };

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Series Slug:", seriesSlug);

        // Get all series to find the matching one
        const allSeries = await getSeriesApi();

        // Find series by slug match
        const foundSeries = allSeries.find((series) => {
          const seriesSlugFromName = createSlug(series.name || series.title);
          return seriesSlugFromName === seriesSlug;
        });

        if (!foundSeries) {
          setError("Series not found");
          setLoading(false);
          return;
        }

        // Add proper thumbnail URL to series
        const seriesWithThumbnail = {
          ...foundSeries,
          thumbnail_url: buildThumbnailUrl(foundSeries.thumbnail_url),
        };
        setSeries(seriesWithThumbnail);

        // ✅ Automatically redirect to introduction
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes("/introduction") &&
          !currentPath.includes("/page1") &&
          !currentPath.includes("/quiz") &&
          !currentPath.includes("/completion")
        ) {
          navigate("introduction", { replace: true });
        }
      } catch (err) {
        console.error("Series fetch error:", err);
        setError("Failed to load series data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesSlug, navigate]);

  const handleStartLearning = () => {
    navigate("introduction");
  };

  const handleBackToBrowse = () => {
    navigate("/child/browse/series");
  };

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <div className="mt-3">
            <p className="text-muted">Loading series...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="text-center">
          <h5>Oops! Something went wrong</h5>
          <p className="mb-3">{error}</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button
              variant="outline-danger"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button variant="primary" onClick={handleBackToBrowse}>
              Back to Series
            </Button>
            <Button variant="outline-primary" onClick={handleBackToDashboard}>
              Dashboard
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ maxWidth: "1200px" }}>
      {/* Navigation */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-secondary" onClick={handleBackToBrowse}>
              <FaArrowLeft className="me-2" /> Back to Series
            </Button>
            <Button variant="outline-primary" onClick={handleBackToDashboard}>
              <FaArrowLeft className="me-2" /> Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      {/* Series Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-start gap-4">
            {series?.thumbnail_url ? (
              <img
                src={series.thumbnail_url}
                alt={series.title}
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/200x150?text=No+Thumbnail";
                }}
              />
            ) : (
              <div
                style={{
                  width: "200px",
                  height: "150px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6c757d",
                  border: "2px dashed #dee2e6",
                }}
              >
                No Thumbnail
              </div>
            )}
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-3 mb-2">
                <h1 className="fw-bold mb-0">
                  {series?.name || series?.title || `Series ${series?.id}`}
                </h1>
                <Badge bg="primary" className="fs-6">
                  <FaListUl className="me-1" />
                  Series
                </Badge>
              </div>
              <p className="text-muted mb-3">
                {series?.description || "Explore this learning series"}
              </p>
              <div className="d-flex align-items-center gap-4">
                <span className="text-muted">
                  {series?.video_count || 0}{" "}
                  {series?.video_count === 1 ? "video" : "videos"}
                </span>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartLearning}
                >
                  <FaPlay className="me-2" /> Start Learning
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* ✅ Nested Routes Render Here - ModuleIntroduction, ModulePage1, etc. */}
      <Outlet />
    </Container>
  );
};

export default SeriesQuizDetail;
