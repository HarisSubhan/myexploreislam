import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  getVideoByIdApi,
  getVideosBySeriesApi,
} from "../../services/seriesApi";
import { baseUrl } from "../../services/config";

const VideoWatch = () => {
  const { seriesId, videoId } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current video data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);

        // Fetch current video details
        if (videoId) {
          const videoData = await getVideoByIdApi(videoId);
          setCurrentVideo(videoData);
        }

        // Fetch recommended videos (other videos from the same series)
        if (seriesId) {
          const seriesVideos = await getVideosBySeriesApi(seriesId);
          // Filter out the current video from recommendations
          const filteredVideos = seriesVideos.filter(
            (video) => video.id.toString() !== videoId
          );
          setRecommendedVideos(filteredVideos.slice(0, 5)); // Show max 5 recommendations
        }
      } catch (err) {
        setError(err.message || "Failed to fetch video data");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [seriesId, videoId]);

  const handleRecommendedClick = (recommendedVideoId) => {
    navigate(
      `/child/series/series/${seriesId}/video/${recommendedVideoId}/player`
    );
  };

  const handleNextVideo = () => {
    // Find current video index
    const currentIndex = recommendedVideos.findIndex(
      (video) => video.id.toString() === videoId
    );

    // If there's a next video, navigate to it
    if (currentIndex < recommendedVideos.length - 1) {
      const nextVideo = recommendedVideos[currentIndex + 1];
      navigate(`/child/series/series/${seriesId}/video/${nextVideo.id}/player`);
    }
  };

  const handlePreviousVideo = () => {
    // Find current video index
    const currentIndex = recommendedVideos.findIndex(
      (video) => video.id.toString() === videoId
    );

    // If there's a previous video, navigate to it
    if (currentIndex > 0) {
      const prevVideo = recommendedVideos[currentIndex - 1];
      navigate(`/child/series/series/${seriesId}/video/${prevVideo.id}/player`);
    }
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading video...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="text-center">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  if (!currentVideo) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning" className="text-center">
          Video not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ maxWidth: "1200px" }}>
      <Row>
        {/* Main Video Player */}
        <Col md={8}>
          <div className="video-player-wrapper">
            {currentVideo.video_url ? (
              <video
                controls
                width="100%"
                height="450"
                style={{ borderRadius: "8px", backgroundColor: "#000" }}
                poster={
                  currentVideo.thumbnail_url
                    ? `${baseUrl}${currentVideo.thumbnail_url}`
                    : ""
                }
              >
                <source
                  src={`${baseUrl}${currentVideo.video_url}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "100%",
                  height: "450px",
                  backgroundColor: "#000",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              >
                <Alert variant="warning" className="text-center m-0">
                  Video file not available.
                </Alert>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="video-info mt-3">
            <h3>{currentVideo.title}</h3>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
              <small className="text-muted">
                Series: {currentVideo.series_title || "N/A"}
              </small>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={handlePreviousVideo}
                  disabled={
                    !recommendedVideos.some(
                      (video, index) =>
                        index <
                        recommendedVideos.findIndex(
                          (v) => v.id.toString() === videoId
                        )
                    )
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleNextVideo}
                  disabled={
                    !recommendedVideos.some(
                      (video, index) =>
                        index >
                        recommendedVideos.findIndex(
                          (v) => v.id.toString() === videoId
                        )
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="video-description border rounded p-3">
            <h5>Description</h5>
            {currentVideo.description ? (
              <p style={{ whiteSpace: "pre-line" }}>
                {currentVideo.description}
              </p>
            ) : (
              <p className="text-muted">No description available.</p>
            )}

            {/* Additional Video Info */}
            <div className="mt-3 pt-3 border-top">
              <Row>
                <Col sm={6}>
                  <strong>Series:</strong> {currentVideo.series_title || "N/A"}
                </Col>
                <Col sm={6}>
                  <strong>Uploaded:</strong>{" "}
                  {currentVideo.created_at
                    ? new Date(currentVideo.created_at).toLocaleDateString()
                    : "N/A"}
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Recommended Videos Sidebar */}
        <Col md={4}>
          <h5 className="mb-3">More in this Series</h5>
          {recommendedVideos.length > 0 ? (
            recommendedVideos.map((video) => (
              <Card
                key={video.id}
                className="mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => handleRecommendedClick(video.id)}
              >
                <Row className="g-0">
                  <Col xs={5}>
                    <div
                      style={{
                        backgroundImage: `url(${video.thumbnail_url ? `${baseUrl}${video.thumbnail_url}` : "/assets/images/book.png"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "80px",
                        borderRadius: "4px 0 0 4px",
                      }}
                    />
                  </Col>
                  <Col xs={7}>
                    <Card.Body style={{ padding: "8px 10px" }}>
                      <Card.Title
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          lineHeight: "1.2rem",
                          marginBottom: "4px",
                        }}
                      >
                        {video.title}
                      </Card.Title>
                      <Card.Text
                        style={{
                          fontSize: "0.8rem",
                          color: "#555",
                          marginBottom: "2px",
                        }}
                      >
                        {video.series_title || "Series"}
                      </Card.Text>
                      <Card.Text
                        style={{
                          fontSize: "0.75rem",
                          color: "#777",
                          marginBottom: "0",
                        }}
                      >
                        {video.created_at
                          ? new Date(video.created_at).toLocaleDateString()
                          : ""}
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <Alert variant="info" className="text-center">
              No other videos in this series.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VideoWatch;
