import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay, FaListUl, FaClock } from "react-icons/fa";
import { getVideosBySeriesApi, getAllVideosApi } from "../../services/videoApi";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";

const SeriesDetail = () => {
  const { seriesSlug } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Series Slug:", seriesSlug);

        // Extract series ID from slug
        const seriesId = extractIdFromSlug(seriesSlug);
        console.log("Extracted Series ID:", seriesId);

        if (!seriesId) {
          setError("Invalid series URL");
          setLoading(false);
          return;
        }

        // METHOD 1: Try to get videos by series ID
        try {
          console.log("Trying to fetch videos by series ID:", seriesId);
          const seriesVideos = await getVideosBySeriesApi(seriesId);
          console.log("Videos from series API:", seriesVideos);

          if (seriesVideos && seriesVideos.length > 0) {
            setVideos(seriesVideos);

            // Get series info
            const allSeries = await getSeriesApi();
            const seriesInfo = allSeries.find((s) => s.id == seriesId);
            setSeries(seriesInfo);
          } else {
            throw new Error("No videos from series API");
          }
        } catch (seriesError) {
          console.log(
            "Series API failed, trying alternative method:",
            seriesError
          );

          // METHOD 2: Alternative - get all videos and filter by series_id
          const allVideos = await getAllVideosApi();
          console.log("All videos:", allVideos);

          const seriesVideos = allVideos.filter(
            (video) => video.series_id == seriesId
          );
          console.log("Filtered series videos:", seriesVideos);

          if (seriesVideos.length > 0) {
            setVideos(seriesVideos);

            // Get series info from series API or use first video's series info
            try {
              const allSeries = await getSeriesApi();
              const seriesInfo = allSeries.find((s) => s.id == seriesId);
              setSeries(seriesInfo);
            } catch {
              // If series API fails, create basic series info
              setSeries({
                id: seriesId,
                title: `Series ${seriesId}`,
                description: "Learning series",
              });
            }
          } else {
            setError("No videos available in this series");
          }
        }
      } catch (err) {
        console.error("Series fetch error:", err);
        setError("Failed to load series data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesSlug]);

  const extractIdFromSlug = (slug) => {
    if (!slug) return null;

    // Try to extract ID from slug (format: "123-series-title")
    const idMatch = slug.match(/^(\d+)-/);
    if (idMatch) {
      return idMatch[1];
    }

    // If no ID in slug, try to find series by title slug
    return null;
  };

  const handleVideoClick = (video) => {
    const videoSlug = createSlug(video.title) || `video-${video.id}`;
    navigate(`/child/series/${seriesSlug}/video/${videoSlug}`, {
      state: {
        videoData: video,
        seriesData: series,
      },
    });
  };

  const handleBackToBrowse = () => {
    navigate("/child/browse/series");
  };

  const handleBackToDashboard = () => {
    navigate("/child");
  };

  const formatDuration = (duration) => {
    if (!duration) return "Unknown";
    if (typeof duration === "number") {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return duration;
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
            <p className="text-muted">Loading series content...</p>
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
            <Button
              variant="outline-secondary"
              onClick={handleBackToBrowse}
              className="d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" />
              Back to Series
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleBackToDashboard}
              className="d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" />
              Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      {/* Series Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-start gap-4">
            {series?.thumbnail_url && (
              <img
                src={series.thumbnail_url}
                alt={series.title}
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            )}
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-3 mb-2">
                <h1 className="fw-bold mb-0">
                  {series?.title || `Series ${series?.id}`}
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
                  {videos.length} {videos.length === 1 ? "video" : "videos"}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Videos List */}
      <Row>
        <Col>
          <h4 className="mb-4">Series Videos</h4>
          {videos.length > 0 ? (
            <Row className="g-4">
              {videos.map((video, index) => (
                <Col xs={12} md={6} lg={4} key={video.id}>
                  <Card
                    className="h-100 border-0 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={video.thumbnail_url || "/assets/images/book.png"}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="position-absolute bottom-0 end-0 m-2">
                        <Badge bg="dark">
                          <FaClock className="me-1" />
                          {formatDuration(video.duration)}
                        </Badge>
                      </div>
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="bg-primary rounded-circle p-2 opacity-75">
                          <FaPlay className="text-white" />
                        </div>
                      </div>
                    </div>
                    <Card.Body>
                      <h6 className="fw-bold">{video.title}</h6>
                      <p className="text-muted small mb-2">
                        {video.description || "No description available"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Episode {index + 1}
                        </small>
                        <Button variant="outline-primary" size="sm">
                          Watch
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="text-center">
              <FaListUl size={32} className="mb-2" />
              <h5>No Videos Available</h5>
              <p>This series doesn't have any videos yet.</p>
              <Button variant="primary" onClick={handleBackToBrowse}>
                Browse Other Series
              </Button>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SeriesDetail;
