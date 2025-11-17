import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Button, Alert, Spinner, Card } from "react-bootstrap";
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
  const { seriesSlug, videoId } = useParams();
  const location = useLocation();
  const videoRef = useRef(null);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [seriesData, setSeriesData] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        console.log("📍 ModulePage1 - Full Location:", location);
        console.log("📍 ModulePage1 - Location State:", location.state);
        console.log("📍 ModulePage1 - Series Slug:", seriesSlug);

        // Step 1: Get series data
        const allSeries = await getSeriesApi();
        const foundSeries = allSeries.find((series) => {
          const seriesSlugFromName = createSlug(series.name || series.title);
          return seriesSlugFromName === seriesSlug;
        });

        if (!foundSeries) {
          setError("Series not found");
          setLoading(false);
          return;
        }

        setSeriesData(foundSeries);
        console.log(
          "🎬 Found series:",
          foundSeries.name,
          "ID:",
          foundSeries.id
        );

        // Step 2: Get all videos for this series
        const allVideosData = await getAllVideosApi();
        const seriesVideos = allVideosData.filter(
          (video) => video.series_id == foundSeries.id
        );

        setAllVideos(seriesVideos);
        console.log("🎥 All videos in series:", seriesVideos);

        // Step 3: Determine which video to play (CRITICAL PART)
        let videoToPlay = null;

        // Priority 1: Check if we have a specific video in location state
        if (location.state?.currentVideo) {
          console.log(
            "🎯 Using video from location state:",
            location.state.currentVideo.title
          );
          videoToPlay = location.state.currentVideo;
        }
        // Priority 2: Check if we have videoId in location state
        else if (location.state?.videoId) {
          const videoId = location.state.videoId;
          videoToPlay = seriesVideos.find((v) => v.id == videoId);
          console.log("🎯 Using video from videoId:", videoToPlay?.title);
        }
        // Priority 3: Check URL search params (alternative approach)
        else {
          const urlParams = new URLSearchParams(window.location.search);
          const videoIdFromUrl = urlParams.get("videoId");
          if (videoIdFromUrl) {
            videoToPlay = seriesVideos.find((v) => v.id == videoIdFromUrl);
            console.log("🎯 Using video from URL params:", videoToPlay?.title);
          }
        }

        // Priority 4: If still no video selected, use first video but show selection
        if (!videoToPlay && seriesVideos.length > 0) {
          console.log(
            "🔄 No specific video selected, using first video:",
            seriesVideos[0].title
          );
          videoToPlay = seriesVideos[0];
        }

        // Then in your useEffect, use the videoId from URL
        if (videoId) {
          videoToPlay = seriesVideos.find((v) => v.id == videoId);
        }

        if (videoToPlay) {
          setSelectedVideo(videoToPlay);
          console.log(
            "✅ Final selected video:",
            videoToPlay.title,
            "ID:",
            videoToPlay.id
          );
        } else {
          setError("No videos available in this series");
        }
      } catch (err) {
        console.error("❌ Error initializing data:", err);
        setError("Failed to load video content: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.state, seriesSlug, location]);

  // Build correct video URL
  const buildVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;
    if (videoUrl.startsWith("http")) return videoUrl;
    if (videoUrl.startsWith("/")) return `${baseUrl}${videoUrl}`;
    return `${baseUrl}/${videoUrl}`;
  };

  // Video controls functions...
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
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (!selectedVideo) {
      console.error("❌ No video selected for quiz");
      return;
    }

    console.log("➡️ Navigating to quiz with video:", selectedVideo.title);
    navigate(`/child/module/${seriesSlug}/quiz`, {
      state: {
        currentVideo: selectedVideo,
        seriesData: seriesData,
        videoId: selectedVideo.id,
      },
    });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
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
          {selectedVideo
            ? `Now Playing: ${selectedVideo.title}`
            : "Select a video to watch"}
        </p>
      </div>

     

      {/* Main Video Player */}
      {selectedVideo && selectedVideo.video_url && (
        <Card
          className="mb-4 border-0 shadow-lg mx-auto"
          style={{ maxWidth: "900px" }}
        >
          <Card.Body className="p-0">
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

              {!isPlaying && (
                <div
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{ cursor: "pointer" }}
                  onClick={handlePlayPause}
                >
                  <div
                    className="bg-primary rounded-circle p-4"
                    style={{ opacity: 0.8, transition: "all 0.3s" }}
                  >
                    <FaPlay className="text-white" size={32} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <h4 className="fw-bold" style={{ color: "#3a86ff" }}>
                {selectedVideo.title}
              </h4>
              <p className="text-muted mb-3">
                {selectedVideo.description ||
                  "Watch this educational video to learn important concepts."}
              </p>

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
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          BACK
        </Button>

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!selectedVideo}
          className="d-flex align-items-center"
        >
          CONTINUE TO QUIZ
          <FaArrowRight className="ms-2" />
        </Button>
      </div>

      {/* Debug Info */}
      <div className="text-center mt-4">
        <small className="text-muted">
          Current Video: {selectedVideo?.title} (ID: {selectedVideo?.id}) |
          Series: {seriesData?.name} | Total Videos: {allVideos.length}
        </small>
      </div>
    </Container>
  );
};

export default ModulePage1;
