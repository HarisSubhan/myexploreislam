import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAllVideosApi } from "../../../services/videoApi";

const CartoonModules = () => {
  const navigate = useNavigate();
  const [singleVideos, setSingleVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache with expiration (5 minutes)
        const cached = localStorage.getItem("singleVideosCache");
        const cacheTimestamp = localStorage.getItem(
          "singleVideosCacheTimestamp"
        );
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

        if (cached && cacheTimestamp) {
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          if (cacheAge < CACHE_DURATION) {
            setSingleVideos(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }

        const data = await getAllVideosApi();
        const baseUrl =
          process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5000";

        console.log("API Response:", data); // Debug log

        // Filter videos where series_id is null (single videos)
        const singleVideosData = data
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
            videoUrl: item.video_url
              ? item.video_url.startsWith("http")
                ? item.video_url
                : item.video_url.startsWith("/")
                  ? `${baseUrl}${item.video_url}`
                  : `${baseUrl}/${item.video_url}`
              : null,
          }));

        console.log("Processed Videos:", singleVideosData); // Debug log

        setSingleVideos(singleVideosData);

        // Cache with timestamp
        localStorage.setItem(
          "singleVideosCache",
          JSON.stringify(singleVideosData)
        );
        localStorage.setItem(
          "singleVideosCacheTimestamp",
          Date.now().toString()
        );
      } catch (err) {
        console.error("Videos API Error:", err);
        setError("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleClick = (videoId) => {
    navigate(`/child/singles/${videoId}`);
  };

  // Clear cache function (optional)
  const clearCache = () => {
    localStorage.removeItem("singleVideosCache");
    localStorage.removeItem("singleVideosCacheTimestamp");
    window.location.reload();
  };

  return (
    <Container fluid className="py-5" style={{ minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: "#0d6efd" }}>
          Single Videos
        </h2>
        <button
          onClick={clearCache}
          className="btn btn-outline-secondary btn-sm"
          title="Clear cache and reload"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger text-center">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-outline-danger ms-3"
          >
            Retry
          </button>
        </div>
      )}

      <Row className="g-4 justify-content-center">
        {(loading ? Array(8).fill({}) : singleVideos).map((item, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={item.id || index}>
            <Card
              className="h-100 border-0 text-center"
              style={{
                cursor: loading ? "default" : "pointer",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              onClick={() => !loading && handleClick(item.id)}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 32px rgba(0,0,0,0.18)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0,0,0,0.1)";
                }
              }}
            >
              {loading ? (
                <Skeleton height={200} />
              ) : (
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
                    e.target.style.padding = "20px";
                  }}
                />
              )}

              <Card.Body>
                {loading ? (
                  <>
                    <Skeleton width={`80%`} height={20} className="mb-1" />
                    <Skeleton width={`60%`} height={15} />
                  </>
                ) : (
                  <>
                    <h5 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
                      {item.title}
                    </h5>
                    <p
                      className="small text-muted mb-0"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {!loading && !error && singleVideos.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No single videos available</p>
        </div>
      )}
    </Container>
  );
};

export default CartoonModules;
