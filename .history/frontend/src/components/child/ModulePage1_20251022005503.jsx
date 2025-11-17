import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Button, Image, Spinner, Alert } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa";
import { getVideoByIdApi } from "../../services/videoApi"; // ✅ Import video API
import { baseUrl } from "../../services/config"; // ✅ Import base URL

const ModulePage1 = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams(); // ✅ Use seriesSlug instead of seriesId
  const location = useLocation();

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);

        // ✅ Check if video data is passed via state
        if (location.state?.videoData) {
          setVideoData(location.state.videoData);
          setLoading(false);
          return;
        }

        // ✅ If videoId is available in state, fetch video data
        if (location.state?.videoId) {
          const data = await getVideoByIdApi(location.state.videoId);
          setVideoData(data);
        } else {
          // ✅ Default practice activity data
          setVideoData({
            title: "Practice Activity",
            description:
              "This activity will help reinforce the concepts you just learned.",
            thumbnail_url: "/frontend/src/assets/images/c.png",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load practice activity");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [location.state]);

  // Build correct video URL
  const buildVideoUrl = (videoUrl) => {
    if (!videoUrl) return null;
    if (videoUrl.startsWith("http")) return videoUrl;
    if (videoUrl.startsWith("/")) return `${baseUrl}${videoUrl}`;
    return `${baseUrl}/${videoUrl}`;
  };

  const handleNext = () => {
    // ✅ Navigate to quiz page
    navigate(`quiz`, {
      state: {
        videoData: videoData,
        seriesData: location.state?.seriesData,
      },
    });
  };

  const handleBack = () => {
    // ✅ Navigate back to introduction
    navigate(`introduction`, {
      state: {
        videoData: videoData,
        seriesData: location.state?.seriesData,
      },
    });
  };

  const handleWatchVideo = () => {
    if (videoData?.video_url) {
      // ✅ Open video in new tab or navigate to video player
      const videoUrl = buildVideoUrl(videoData.video_url);
      window.open(videoUrl, "_blank");
    }
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
      {/* Lesson Title */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        {videoData?.title ? videoData.title.toUpperCase() : "PRACTICE ACTIVITY"}
      </h4>

      {/* Video Thumbnail with Play Button */}
      <div className="d-flex justify-content-center mb-3 position-relative">
        <Image
          src={
            videoData?.thumbnail_url ||
            "https://via.placeholder.com/600x400/667eea/ffffff?text=Practice+Activity"
          }
          alt="Learning Activity"
          fluid
          style={{
            maxWidth: "600px",
            borderRadius: "10px",
            border: "2px solid #ddd",
            cursor: videoData?.video_url ? "pointer" : "default",
          }}
          onClick={handleWatchVideo}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/600x400/667eea/ffffff?text=Practice+Activity";
          }}
        />

        {/* Play Button Overlay */}
        {videoData?.video_url && (
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{ cursor: "pointer" }}
            onClick={handleWatchVideo}
          >
            <div
              className="bg-primary rounded-circle p-3 opacity-75"
              style={{
                transition: "all 0.3s",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "0.75";
              }}
            >
              <FaPlay className="text-white" size={24} />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="text-center mb-4">
        <h5 style={{ color: "#ff1493" }}>Practice What You Learned</h5>
        <p className="text-muted">
          {videoData?.description ||
            "This activity will help reinforce the concepts you just learned in the video. Take your time and think carefully about each question."}
        </p>

        {/* Watch Video Button */}
        {videoData?.video_url && (
          <Button
            variant="outline-primary"
            onClick={handleWatchVideo}
            className="d-flex align-items-center mx-auto mb-3"
          >
            <FaPlay className="me-2" />
            Watch Video Again
          </Button>
        )}
      </div>

      {/* Activity Instructions */}
      <div
        className="bg-light p-4 rounded-3 mb-4 mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <h6 className="fw-bold mb-3">📝 Activity Instructions:</h6>
        <ul className="mb-0">
          <li>Review the key concepts from the video</li>
          <li>Complete the practice exercises</li>
          <li>Think about real-life applications</li>
          <li>Prepare for the quiz in the next step</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div
        className="d-flex justify-content-between mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <Button
          onClick={handleBack}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "10px 20px",
          }}
        >
          <FaArrowLeft className="me-2" />
          BACK
        </Button>

        <Button
          onClick={handleNext}
          style={{
            background: "linear-gradient(135deg, #ff1493 0%, #3a86ff 100%)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "10px 20px",
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
