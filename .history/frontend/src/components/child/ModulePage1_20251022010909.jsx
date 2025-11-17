import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Button, Alert, Spinner } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaPlay } from "react-icons/fa";
import { getVideoByIdApi } from "../../services/videoApi";
import { getSeriesApi } from "../../services/seriesApi";
import { createSlug } from "../../utils/slugify";

const ModulePage1 = () => {
  const navigate = useNavigate();
  const { seriesSlug } = useParams();
  const location = useLocation();

  const [videoData, setVideoData] = useState(null);
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Data initialize karein
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        console.log("📍 ModulePage1 - Location State:", location.state);

        // ✅ Pehle state se data lein
        if (location.state?.videoData) {
          setVideoData(location.state.videoData);
        }

        if (location.state?.seriesData) {
          setSeriesData(location.state.seriesData);
        }

        // ✅ Agar state mein data nahi hai, to fetch karein
        if (!location.state?.videoData && location.state?.videoId) {
          console.log("📹 Fetching video data for ID:", location.state.videoId);
          const video = await getVideoByIdApi(location.state.videoId);
          setVideoData(video);
        }

        // ✅ Agar series data nahi hai, to fetch karein
        if (!location.state?.seriesData && seriesSlug) {
          console.log("🎬 Fetching series data for slug:", seriesSlug);
          const allSeries = await getSeriesApi();
          const foundSeries = allSeries.find((series) => {
            const seriesSlugFromName = createSlug(series.name || series.title);
            return seriesSlugFromName === seriesSlug;
          });
          if (foundSeries) setSeriesData(foundSeries);
        }

        // ✅ Agar koi data nahi mila, to default set karein
        if (!videoData && !location.state?.videoId) {
          setVideoData({
            title: "Practice Activity",
            description:
              "This activity will help reinforce the concepts you just learned.",
            thumbnail_url:
              "https://via.placeholder.com/600x400/667eea/ffffff?text=Practice+Activity",
          });
        }
      } catch (err) {
        console.error("❌ Error initializing data:", err);
        setError("Failed to load practice activity");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.state, seriesSlug]);

  // Alternative absolute paths
  const handleBack = () => {
    navigate(`/child/module/${seriesSlug}/introduction`, {
      state: { videoData, seriesData, ...location.state },
    });
  };

  const handleNext = () => {
    navigate(`/child/module/${seriesSlug}/quiz`, {
      state: { videoData, seriesData, ...location.state },
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
          <p className="mt-2">Loading practice activity...</p>
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
          <h5>Error Loading Activity</h5>
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
      {/* Debug Info */}
      <Alert variant="info" className="text-center">
        <h4>🔍 Debug Info - ModulePage1</h4>
        <p>
          Series Slug: <strong>{seriesSlug}</strong>
        </p>
        <p>
          Has State Data: <strong>{location.state ? "Yes" : "No"}</strong>
        </p>
        <p>
          Video Data: <strong>{videoData ? "Loaded" : "Not Loaded"}</strong>
        </p>
        <p>
          Series Data: <strong>{seriesData ? "Loaded" : "Not Loaded"}</strong>
        </p>
      </Alert>

      {/* Main Content */}
      <h4 className="fw-bold mb-4 text-center" style={{ color: "#3a86ff" }}>
        {videoData?.title ? videoData.title.toUpperCase() : "PRACTICE ACTIVITY"}
      </h4>

      <div className="text-center mb-4">
        <h5 style={{ color: "#ff1493" }}>Practice What You Learned</h5>
        <p className="text-muted">
          {videoData?.description ||
            "This activity will help reinforce the concepts you just learned."}
        </p>
      </div>

      {/* Activity Instructions */}
      <div
        className="bg-light p-4 rounded-3 mb-4 mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <h6 className="fw-bold mb-3">📝 Activity Instructions:</h6>
        <ul className="mb-0">
          <li>
            Review the key concepts from {seriesData?.name || "the series"}
          </li>
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
        <Button variant="secondary" onClick={handleBack}>
          <FaArrowLeft className="me-2" />
          BACK TO INTRODUCTION
        </Button>

        <Button variant="primary" onClick={handleNext}>
          CONTINUE TO QUIZ
          <FaArrowRight className="ms-2" />
        </Button>
      </div>
    </Container>
  );
};

export default ModulePage1;
