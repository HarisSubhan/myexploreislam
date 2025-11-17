import React, { useState, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { getVideoByIdApi } from "../../services/seriesApi"; // You'll need to create this API function

const ModuleIntroduction = () => {
  const navigate = useNavigate();
  const { seriesId, videoId } = useParams(); // Get both IDs from URL
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch video data when component mounts
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const data = await getVideoByIdApi(videoId); // Create this API function
        setVideoData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch video data");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  const handleNext = () => {
    // Navigate to the actual video player page
    navigate(`/child/series/series/${seriesId}/video/${videoId}/player`);
  };

  const handlePlayAudio = () => {
    // Implement audio playback logic here
    console.log("Play audio for:", videoData?.title);
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ background: "#f8fbff", minHeight: "100vh" }}
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
        style={{ background: "#f8fbff", minHeight: "100vh" }}
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
      style={{ background: "#f8fbff", minHeight: "100vh" }}
    >
      {/* Dynamic Title */}
      <h2 className="fw-bold text-center mb-4" style={{ color: "#ff1493" }}>
        {videoData?.series_title || "Series"} - Introduction
      </h2>

      {/* Dynamic Lesson title */}
      <h4 className="fw-bold mb-4" style={{ color: "#3a86ff" }}>
        {videoData?.title ? videoData.title.toUpperCase() : "LESSON"}
      </h4>

      {/* Dynamic Lesson Content */}
      <Card
        className="p-4 border-0 shadow-sm"
        style={{ borderRadius: "15px", background: "#fff" }}
      >
        {videoData?.description ? (
          <div
            style={{ color: "#ff1493", fontSize: "1.1rem", lineHeight: "1.7" }}
            dangerouslySetInnerHTML={{
              __html: videoData.description.replace(/\n/g, "<br />"),
            }}
          />
        ) : (
          <p
            style={{ color: "#ff1493", fontSize: "1.1rem", lineHeight: "1.7" }}
          >
            No description available for this video.
          </p>
        )}

        {/* Voice Note */}
        <div className="d-flex justify-content-end align-items-center mt-3">
          <Button
            variant="link"
            onClick={handlePlayAudio}
            style={{ padding: 0, border: "none" }}
          >
            <FaVolumeUp size={30} color="#3a86ff" className="me-2" />
          </Button>
        </div>
      </Card>

      {/* Next Button */}
      <div className="text-end mt-4">
        <Button
          onClick={handleNext}
          style={{
            background: "transparent",
            border: "none",
            color: "#ff1493",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          NEXT →
        </Button>
      </div>
    </Container>
  );
};

export default ModuleIntroduction;
