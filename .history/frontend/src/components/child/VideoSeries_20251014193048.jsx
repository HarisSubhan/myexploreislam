import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../services/config";
import { getVideosBySeriesApi } from "../../services/videoApi";

const VideoSeries = () => {
  const { id } = useParams(); // This is the series ID from URL
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        setLoading(true);
        const videosData = await getVideosBySeriesApi(id);

        console.log("API Response:", videosData);

        const transformedSeasons = videosData.map((video, index) => ({
          id: video.id, // This is the video ID
          seriesId: video.series_id, // This is the series ID
          title: video.title || `Video ${index + 1}`,
          description: video.description,
          color: getSeasonColor(index),
          img: video.thumbnail_url
            ? video.thumbnail_url.startsWith("http")
              ? video.thumbnail_url
              : `${baseUrl}${video.thumbnail_url}`
            : "/assets/images/book.png",
        }));

        console.log("Transformed Seasons:", transformedSeasons);
        setSeasons(transformedSeasons);
      } catch (err) {
        setError(err.message || "Failed to fetch series data");
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [id]);

  const getSeasonColor = (index) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6A0572", "#1A936F"];
    return colors[index % colors.length];
  };

  const handleWatchClick = (videoId, seriesId) => {
    // Navigate to introduction page for the specific video
    navigate(`/child/series/series/${seriesId}/video/${videoId}/introduction`);
  };

  const handleCardClick = (videoId, seriesId) => {
    // Navigate to videos page or introduction
    navigate(`/child/series/series/${seriesId}/video/${videoId}/introduction`);
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ background: "#f8f9fa", minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="py-5"
        style={{ background: "#f8f9fa", minHeight: "100vh" }}
      >
        <Alert variant="danger" className="text-center">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="py-5"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <h2 className="text-center fw-bold mb-5" style={{ color: "#3A86FF" }}>
        📺 Choose Your Video
      </h2>

      {seasons.length === 0 ? (
        <Alert variant="info" className="text-center">
          No videos available for this series.
        </Alert>
      ) : (
        <Row className="g-4 mb-5">
          {seasons.map((season, index) => (
            <Col xs={12} sm={6} md={4} key={season.id}>
              <Card
                onClick={() => handleCardClick(season.id, season.seriesId)}
                style={{
                  borderRadius: "10px",
                  border: "4px solid #fff",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                className="hover-card"
              >
                <div
                  style={{
                    height: "220px",
                    background: season.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundImage: season.img
                      ? `url('${season.img}')`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {(!season.img || season.img.includes("book.png")) &&
                    season.title}
                </div>
                <Card.Body>
                  <Card.Title>{season.title}</Card.Title>
                  {season.description && (
                    <Card.Text className="text-muted">
                      {season.description.length > 100
                        ? `${season.description.substring(0, 100)}...`
                        : season.description}
                    </Card.Text>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchClick(season.id, season.seriesId);
                    }}
                    className="btn btn-primary w-100"
                  >
                    Watch Now
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default VideoSeries;
