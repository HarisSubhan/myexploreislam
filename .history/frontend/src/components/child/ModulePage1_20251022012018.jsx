import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlay,
  FaVideo,
  FaPause,
} from "react-icons/fa";
import { getVideoByIdApi, getAllVideosApi } from "../../services/videoApi";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";
import { baseUrl } from "../../services/config";

const ModulePage1 = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams();
  const location = useLocation();
  const videoRef = useRef(null);

  const [videoData, setVideoData] = useState(null);
  const [seriesData, setSeriesData] = useState(null);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ✅ Data initialize karein
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        console.log("📍 ModulePage1 - Location State:", location.state);

        // ✅ Pehle state se data lein
        if (location.state?.videoData) {
          setVideoData(location.state.videoData);
          setSelectedVideo(location.state.videoData);
        }

        if (location.state?.seriesData) {
          setSeriesData(location.state.seriesData);
        }

        // ✅ Agar series data nahi hai, to fetch karein
        if (!location.state?.seriesData && seriesSlug) {
          console.log("🎬 Fetching series data for slug:", seriesSlug);
          const allSeries = await getSeriesApi();
          const foundSeries = allSeries.find((series) => {
            const seriesSlugFromName = createSlug(series.name || series.title);
            return seriesSlugFromName === seriesSlug;
          });
          if (foundSeries) {
            setSeriesData(foundSeries);

            // ✅ Series ke saare videos fetch karein
            try {
              const videos = await getAllVideosApi();
              const seriesVideos = videos.filter(
                (video) => video.series_id == foundSeries.id
              );
              setAllVideos(seriesVideos);
              console.log("🎥 Series Videos:", seriesVideos);

              // ✅ Agar koi specific video selected nahi hai, to pehla video select karein
              if (!location.state?.videoData && seriesVideos.length > 0) {
                setSelectedVideo(seriesVideos[0]);
                setVideoData(seriesVideos[0]);
              }
            } catch (videoErr) {
              console.error("❌ Error fetching videos:", videoErr);
            }
          }
        }

        // ✅ Agar video data nahi hai, to fetch karein
        if (!location.state?.videoData && location.state?.videoId) {
          console.log("📹 Fetching video data for ID:", location.state.videoId);
          const video = await getVideoByIdApi(location.state.videoId);
          setVideoData(video);
          setSelectedVideo(video);
        }
      } catch (err) {
        console.error("❌ Error initializing data:", err);
        setError("Failed to load video content");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.state, seriesSlug]);

  // Build correct video URL
  const buildVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;
    if (videoUrl.startsWith("http")) return videoUrl;
    if (videoUrl.startsWith("/")) return `${baseUrl}${videoUrl}`;
    return `${baseUrl}/${videoUrl}`;
  };

  

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    navigate(`/child/module/${seriesSlug}/quiz`, {
      state: {
        videoData: selectedVideo,
        seriesData: seriesData,
        ...location.state,
      },
    });
  };

  const handleBack = () => {
    navigate(`/child/module/${seriesSlug}/introduction`, {
      state: {
        videoData: selectedVideo,
        seriesData: seriesData,
        ...location.state,
      },
    });
  };

  if (loading) {
    return (
      <Container
        fluid
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ background: "#f8fbff", minHeight: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading video content...</p>
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
          <h5>Error Loading Video</h5>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: "#0d6efd" }}>
          <FaVideo className="me-2" />
          Watch & Learn
        </h2>
        <p className="text-muted">
          Watch the video to continue your learning journey
        </p>
      </div>

      {/* Main Video Player */}
      {selectedVideo && selectedVideo.video_url && (
        <Card
          className="mb-4 border-0 shadow-lg mx-auto"
          style={{ maxWidth: "900px" }}
        >
          <Card.Body className="p-0">
            {/* Video Player */}
            <div className="position-relative">
              <video
                ref={videoRef}
                className="w-100"
                style={{
                  height: "400px",
                  backgroundColor: "#000",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls
              >
                <source
                  src={buildVideoUrl(selectedVideo.video_url)}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Custom Play/Pause Overlay */}
              {!isPlaying && (
                <div
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{ cursor: "pointer" }}
                  onClick={handlePlayPause}
                >
                  <div
                    className="bg-primary rounded-circle p-4"
                    style={{
                      opacity: 0.8,
                      transition: "all 0.3s",
                    }}
                  >
                    <FaPlay className="text-white" size={32} />
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h4 className="fw-bold" style={{ color: "#3a86ff" }}>
                {selectedVideo.title}
              </h4>
              <p className="text-muted mb-3">
                {selectedVideo.description ||
                  "Watch this educational video to learn important concepts."}
              </p>

              {/* Video Controls */}
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant={isPlaying ? "outline-danger" : "outline-success"}
                  onClick={handlePlayPause}
                  className="d-flex align-items-center"
                >
                  {isPlaying ? (
                    <FaPause className="me-2" />
                  ) : (
                    <FaPlay className="me-2" />
                  )}
                  {isPlaying ? "Pause" : "Play"}
                </Button>

                <div className="text-muted">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

     
      {/* Navigation Buttons */}
      <div
        className="d-flex justify-content-between mx-auto"
        style={{ maxWidth: "900px" }}
      >
        <Button
          variant="secondary"
          onClick={handleBack}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "12px 24px",
          }}
        >
          <FaArrowLeft className="me-2" />
          BACK
        </Button>

        <Button
          variant="primary"
          onClick={handleNext}
          style={{
            background: "linear-gradient(135deg, #ff1493 0%, #3a86ff 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "12px 24px",
          }}
        >
          CONTINUE TO QUIZ
          <FaArrowRight className="ms-2" />
        </Button>
      </div>
    </Container>
  );
};

export default ModulePage1;
