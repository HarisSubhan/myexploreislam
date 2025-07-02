import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./VideoThumbnails.css";
import { useTheme } from "../../context/ThemeContext";
import { getAllVideosApi } from "../../services/videoApi";
import { getQuizApi } from "../../services/quizApi";
import { getAllAssignments } from "../../services/assignmentApi";

const VideoThumbnails = () => {
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("Episodes");

  const { color: themeColor, textColor } = useTheme();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const videos = await getAllVideosApi();
        const allAssignments = await getAllAssignments();

        const enrichedVideos = await Promise.all(
          videos.map(async (video) => {
            let quizzes = [];
            try {
              quizzes = await getQuizApi(video.id);
            } catch (err) {
              console.warn(`Quiz fetch failed for video ${video.id}`);
            }

            const assignments = allAssignments.filter(a => a.video_id === video.id);

            return { ...video, quizzes, assignments };
          })
        );

        setVideoData(enrichedVideos);
      } catch (err) {
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = expandedVideo ? "hidden" : "auto";
  }, [expandedVideo]);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setExpandedVideo(null);
      setIsFadingOut(false);
    }, 300);
  };

  const handlePlayClick = (id, e) => {
    e.stopPropagation();
    navigate(`/child/video/${id}`);
  };

  const selectedVideo = videoData.find((v) => v.id === expandedVideo);

  const renderTabContent = () => {
    if (!selectedVideo) return null;

    switch (activeTab) {
      case "Episodes":
        return (
          <>
            <div className="episodes-header">
              <h4>Episodes</h4>
              <select className="season-selector">
                <option>Season 1 (10 EP)</option>
              </select>
            </div>
            <div className="episodes-list">
              {[...Array(10)].map((_, i) => (
                <div className="episode" key={i}>
                  <div className="episode-thumb">
                    <img src={selectedVideo.thumbnail_url} alt={`Episode ${i + 1}`} />
                  </div>
                  <div className="episode-details">
                    <div className="episode-title">Episode {i + 1}</div>
                    <div className="episode-duration">44m</div>
                    <div className="episode-desc">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case "Quiz":
        return (
          <div className="quiz-content">
            <h4>Quizzes</h4>
            <div className="quiz-list">
              {(selectedVideo.quizzes || []).map((quiz) => (
                <div className="quiz-item" key={quiz.id}>
                  <h5>{quiz.title}</h5>
                  <div className="quiz-meta">
                    <span>{quiz.questions || "?"} questions</span>
                    <span>{quiz.duration || "?"}</span>
                  </div>
                  <button className="start-quiz-btn">Start Quiz</button>
                </div>
              ))}
            </div>
          </div>
        );
      case "Assignment":
        return (
          <div className="assignment-content">
            <h4>Assignments</h4>
            <div className="assignment-list">
              {(selectedVideo.assignments || []).map((assignment) => (
                <div className="assignment-item" key={assignment.id}>
                  <h5>{assignment.title}</h5>
                  <div className="assignment-meta">
                    <span>Due: {assignment.due}</span>
                    <span>Points: {assignment.points}</span>
                  </div>
                  <button className="view-assignment-btn">View Assignment</button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="netflix-container">
      {loading && <Spinner animation="border" className="d-block mx-auto mt-5" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="thumbnails-row">
        {videoData.map((video) => (
          <Col
            key={video.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            className="thumbnail-col"
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
            onClick={() => setExpandedVideo(video.id)}
          >
            <div className="netflix-card-wrapper">
              <Card className="netflix-thumbnail">
                <div className="thumbnail-image-container">
                  <img src={video.thumbnail_url} alt={video.title} />
                  <span className="video-quality">{video.quality}</span>
                </div>
              </Card>

              {hoveredVideo === video.id && (
                <div className="netflix-hover-card">
                  <div className="hover-thumbnail">
                    <img src={video.thumbnail_url} alt={video.title} />
                  </div>
                  <div style={{ backgroundColor: themeColor, color: textColor }} className="hover-details">
                    <div className="action-buttons d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <button
                          className="action-btn"
                          onClick={(e) => handlePlayClick(video.id, e)}
                        >
                          <FaPlay />
                        </button>
                      </div>
                      <button className="action-btn more-btn" onClick={() => setExpandedVideo(video.id)}>
                        <FaChevronDown />
                      </button>
                    </div>
                    <div className="match-rating">
                      <span className="match">{video.match}</span>
                      <span className="age-rating">{video.rating}</span>
                      <span>{video.seasons}</span>
                      <span className="hd-badge">{video.quality}</span>
                    </div>
                    <div className="genre-tags">
                      {(video.genres || []).map((genre, index) => (
                        <span key={index}>{genre}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>

      {selectedVideo && (
        <div
          style={{ backgroundColor: themeColor, color: textColor }}
          className={`expanded-video-popup ${isFadingOut ? "fade-out" : ""}`}
        >
          <div className="popup-header">
            <img src={selectedVideo.thumbnail_url} alt={selectedVideo.title} className="banner-image" />
            <IoMdCloseCircleOutline className="close-btn" onClick={handleClose} />
          </div>

          <div className="popup-content mx-auto">
            <div className="metadata">
              <span className="match">{selectedVideo.match}</span>
              <span className="year">2022</span>
              <span className="rating">{selectedVideo.rating}</span>
              <span className="seasons">{selectedVideo.seasons}</span>
              <span className="genres">{(selectedVideo.genres || []).join(", ")}</span>
            </div>

            <p className="description">{selectedVideo.description}</p>

            <div className="language-tabs">
              <div className="tab-buttons">
                {["Episodes", "Quiz", "Assignment"].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>
      )}
    </Container>
  );
};

export default VideoThumbnails;