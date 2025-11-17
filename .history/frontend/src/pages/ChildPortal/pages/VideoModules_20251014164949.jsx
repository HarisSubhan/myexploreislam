import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getSeriesApi } from "../../../services/seriesApi";

const VideoModules = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);

        const cached = localStorage.getItem("seriesCache");
        if (cached) {
          setSeries(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const data = await getSeriesApi();
        const baseUrl =
          import.meta.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5000";

        const formatted = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail_url?.startsWith("http")
            ? item.thumbnail_url
            : new URL(item.thumbnail_url, baseUrl).href,
        }));

        setSeries(formatted);

        // Cache for next reload
        localStorage.setItem("seriesCache", JSON.stringify(formatted));
      } catch (err) {
        console.log("Series API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  const handleClick = (id) => {
    // ✅ matches ChildRoutes path
    navigate(`/child/series/series/${id}`);
  };

  return (
    <Container fluid className="py-5" style={{ minHeight: "100vh" }}>
      <h2 className="text-center fw-bold mb-4" style={{ color: "#0d6efd" }}>
        Select a Cartoon Series
      </h2>

      <Row className="g-4 justify-content-center">
        {(loading ? Array(8).fill({}) : series).map((item, index) => (
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
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/default-thumb.png";
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
                    <h5 className="fw-bold mb-1">{item.title}</h5>
                    <p className="small text-muted mb-0">{item.description}</p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VideoModules;
