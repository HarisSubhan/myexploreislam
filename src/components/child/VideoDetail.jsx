import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { getVideoByIdApi } from "../../services/videoApi";

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await getVideoByIdApi(videoId);
        setVideo(data);
      } catch (err) {
        setError("Video not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <video
            src={video.videoUrl}
            controls
            className="w-100 rounded mb-3"
            poster={video.thumbnail}
          />
          <h3>{video.title}</h3>
          <p className="text-muted">
            {video.views} • {video.time}
          </p>
          <p>
            <strong>Channel:</strong> {video.channel}
          </p>
          <p>
            <strong>Description:</strong> {video.description}
          </p>
          <p>
            <strong>Duration:</strong> {video.duration}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoDetail;
