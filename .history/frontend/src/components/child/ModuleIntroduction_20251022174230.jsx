import React, { useState, useEffect } from "react";
import {
  FaVolumeUp,
  FaPlay,
  FaArrowLeft,
  FaVideo,
  FaExclamationTriangle,
  FaStop,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { getSeriesApi } from "../../services/seriesApi";
import { getAllVideosApi, getVideoByIdApi } from "../../services/videoApi";
import { createSlug } from "../../utils/slugify";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";

const ModuleIntroduction = () => {
  const navigate = useNavigate();
  const { seriesSlug, videoId } = useParams();
  const location = useLocation();

  const [series, setSeries] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSingleVideo, setIsSingleVideo] = useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const videoDataFromState = location.state?.currentVideo;
  const videoIdFromState = location.state?.videoId;
  const seriesDataFromState = location.state?.seriesData;
  const isSingleVideoFromState = location.state?.isSingleVideo;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const isSingleVideoFlow =
          isSingleVideoFromState ||
          (location.pathname.includes("/module/single/") && videoId);

        if (isSingleVideoFlow) {
          setIsSingleVideo(true);

          let videoData = null;

          if (videoDataFromState) {
            videoData = videoDataFromState;
          } else if (videoId) {
            videoData = await getVideoByIdApi(videoId);
          }

          if (videoData) {
            setSelectedVideo(videoData);
          } else {
            setError("Single video not found");
          }

          setLoading(false);
          return;
        }

        if (!seriesSlug) {
          setError("No series selected");
          setLoading(false);
          return;
        }

        const allSeries = await getSeriesApi();
        const foundSeries = allSeries.find((seriesItem) => {
          const seriesSlugFromName = createSlug(
            seriesItem.name || seriesItem.title
          );
          return seriesSlugFromName === seriesSlug;
        });

        if (!foundSeries) {
          setError("Series not found");
          setLoading(false);
          return;
        }

        setSeries(foundSeries);

        const allVideosData = await getAllVideosApi();
        const seriesVideos = allVideosData.filter(
          (video) => video.series_id == foundSeries.id
        );

        setVideos(seriesVideos);

        let videoToSelect = null;

        if (videoDataFromState) {
          videoToSelect = videoDataFromState;
        } else if (videoIdFromState) {
          videoToSelect = seriesVideos.find((v) => v.id == videoIdFromState);
        } else if (seriesVideos.length > 0) {
          videoToSelect = seriesVideos[0];
        }

        if (videoToSelect) {
          setSelectedVideo(videoToSelect);
        }
      } catch (err) {
        setError("Failed to load data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    seriesSlug,
    videoId,
    videoDataFromState,
    videoIdFromState,
    isSingleVideoFromState,
    location.pathname,
  ]);

  const handleContinue = () => {
    if (!selectedVideo) {
      setError("Cannot continue: Please select a video first");
      return;
    }

    if (isSpeaking) {
      stop();
    }

    if (isSingleVideo) {
      navigate(`/child/module/single/${selectedVideo.id}/page1`, {
        state: {
          currentVideo: selectedVideo,
          videoId: selectedVideo.id,
          isSingleVideo: true,
        },
      });
    } else if (seriesSlug) {
      navigate(`/child/module/${seriesSlug}/page1/${selectedVideo.id}`, {
        state: {
          currentVideo: selectedVideo,
          seriesData: seriesDataFromState || series,
          videoId: selectedVideo.id,
          seriesSlug: seriesSlug,
        },
      });
    } else {
      setError("Navigation error: Missing route information");
    }
  };

  const handleVideoSelect = (video) => {
    if (isSingleVideo) return;
    setSelectedVideo(video);
  };

  const handleBack = () => {
    if (isSpeaking) {
      stop();
    }
    navigate("/child/module");
  };

  const handlePlayAudio = () => {
    let textToSpeak = "";

    if (isSingleVideo) {
      textToSpeak = selectedVideo?.description
        ? selectedVideo.description.replace(/<[^>]*>/g, "")
        : "Welcome to this educational video! You'll learn important concepts through engaging content and test your knowledge with an interactive quiz. Get ready to enhance your learning experience!";
    } else {
      textToSpeak = series?.description
        ? series.description.replace(/<[^>]*>/g, "")
        : "Welcome to this exciting learning series! In this course, you'll explore amazing content and enhance your knowledge through engaging videos and interactive quizzes.";
    }

    const fullText = `Introduction: ${textToSpeak}. Click the Start Learning button to begin.`;
    speak(fullText);
  };

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stop();
      }
    };
  }, [isSpeaking, stop]);

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ background: "#f8fbff", minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading introduction...</p>
        </div>
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
          <h5>Error Loading Introduction</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleBack}
              className="ms-2"
            >
              Back to Modules
            </Button>
          </div>
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
      <div className="mb-4">
        <Button
          variant="outline-primary"
          onClick={handleBack}
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          Back to Modules
        </Button>
      </div>

      <div className="text-center mb-5">
        <Badge
          bg={isSingleVideo ? "success" : "primary"}
          className="fs-6 mb-3 px-3 py-2"
        >
          {isSingleVideo ? "Single Video" : series?.name || "Learning Series"}
        </Badge>
        <h1 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
          {isSingleVideo ? "Welcome to the Video!" : "Welcome to the Series!"}
        </h1>
        <p className="text-muted fs-5">
          {isSingleVideo
            ? "Get ready for this learning video"
            : "Get ready for an amazing learning journey"}
        </p>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card
            className="border-0 shadow-lg mb-4"
            style={{ borderRadius: "20px", overflow: "hidden" }}
          >
            <Card.Body className="p-5">
              {isSingleVideo && selectedVideo && (
                <div className="text-center mb-4">
                  <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25">
                    <FaVideo className="text-success mb-2" size={24} />
                    <h5 className="fw-bold text-success">Ready to Start</h5>
                    <p className="mb-1 fs-5 fw-semibold">
                      {selectedVideo.title}
                    </p>
                    <small className="text-muted">
                      {selectedVideo.description || "Get ready to learn!"}
                    </small>
                  </div>
                </div>
              )}

              {!isSingleVideo && videos.length > 1 && (
                <div className="mb-4 p-3 bg-light rounded-3">
                  <h5 className="fw-bold mb-3">
                    <FaVideo className="text-primary me-2" />
                    Select Video to Start
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {videos.map((video, index) => (
                      <Button
                        key={video.id}
                        variant={
                          selectedVideo?.id === video.id
                            ? "primary"
                            : "outline-primary"
                        }
                        size="sm"
                        onClick={() => handleVideoSelect(video)}
                        className="mb-2"
                      >
                        Episode {index + 1}: {video.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!isSingleVideo && selectedVideo && (
                <div className="text-center mb-4 p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25">
                  <FaVideo className="text-success mb-2" size={24} />
                  <h5 className="fw-bold text-success">Ready to Start</h5>
                  <p className="mb-1 fs-5 fw-semibold">{selectedVideo.title}</p>
                  <small className="text-muted">
                    {selectedVideo.description || "Get ready to learn!"}
                  </small>
                </div>
              )}

              {!selectedVideo && (
                <Alert variant="warning" className="text-center">
                  <FaExclamationTriangle className="me-2" />
                  No video available.
                </Alert>
              )}

              <h3
                className="fw-bold text-center mb-4"
                style={{ color: "#3a86ff" }}
              >
                {isSingleVideo
                  ? "VIDEO INTRODUCTION"
                  : series?.name
                    ? series.name.toUpperCase()
                    : "SERIES INTRODUCTION"}
              </h3>

              <div className="mb-4">
                {isSingleVideo ? (
                  <div
                    style={{
                      color: "#333",
                      fontSize: "1.1rem",
                      lineHeight: "1.7",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: selectedVideo?.description
                        ? selectedVideo.description.replace(/\n/g, "<br />")
                        : "Welcome to this educational video! You'll learn important concepts through engaging content and test your knowledge with an interactive quiz. Get ready to enhance your learning experience!",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color: "#333",
                      fontSize: "1.1rem",
                      lineHeight: "1.7",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: series?.description
                        ? series.description.replace(/\n/g, "<br />")
                        : "Welcome to this exciting learning series! In this course, you'll explore amazing content and enhance your knowledge through engaging videos and interactive quizzes.",
                    }}
                  />
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
                <Button
                  variant={isSpeaking ? "warning" : "outline-primary"}
                  onClick={handlePlayAudio}
                  className="d-flex align-items-center px-4 py-2"
                  disabled={!selectedVideo && !series}
                >
                  {isSpeaking ? (
                    <>
                      <FaStop className="me-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <FaVolumeUp className="me-2" />
                      Listen Introduction
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleContinue}
                  className="d-flex align-items-center px-5 py-2"
                  style={{
                    background: selectedVideo
                      ? "linear-gradient(135deg, #ff1493, #3a86ff)"
                      : "#6c757d",
                    border: "none",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  disabled={!selectedVideo}
                >
                  {selectedVideo ? "Start Learning" : "Select Video First"}
                  <FaPlay className="ms-2" />
                </Button>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center">
            <small className="text-muted">
              Step 1 of 4: Introduction → Video → Quiz → Completion
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ModuleIntroduction;
