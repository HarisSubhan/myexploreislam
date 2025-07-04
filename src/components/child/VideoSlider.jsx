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

  

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
       
        const [videosResponse, assignmentsResponse] = await Promise.all([
          getAllVideosApi(),
          getAllAssignments().catch(err => {
            console.warn("Assignments fetch error:", err);
            return []; 
          })
        ]);

        
        console.log("Videos response:", videosResponse);
        console.log("Assignments response:", assignmentsResponse);

        
        const enrichedVideos = await Promise.all(
          videosResponse.map(async (video) => {
            
            let quizzes = [];
            try {
              quizzes = await getQuizApi(video.id) || [];
            } catch (err) {
              console.warn(`Quiz fetch failed for video ${video.id}:`, err);
            }

       
            const assignments = (assignmentsResponse || []).filter(a => 
              String(a.video_id) === String(video.id)
            );

            console.log(`Video ${video.id} assignments:`, assignments);

            return {
              ...video,
              quizzes: quizzes || [],
              assignments: assignments || [],
              genres: video.genres || [],
              description: video.description || "No description available",
              thumbnail_url: video.thumbnail_url || "/default-thumbnail.jpg"
            };
          })
        );

        setVideoData(enrichedVideos);
      } catch (err) {
        console.error("Data fetching failed:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = expandedVideo ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
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

  const handlePlayQuiz = (quizId) => {
    navigate(`/child/quiz/${quizId}`);
  };

  const handleViewAssignment = (assignmentId) => {
    navigate(`/child/assignments/${assignmentId}`);
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
                    <img 
                      src={selectedVideo.thumbnail_url} 
                      alt={`Episode ${i + 1}`} 
                      onError={(e) => {
                        e.target.src = "/default-thumbnail.jpg";
                      }}
                    />
                  </div>
                  <div className="episode-details">
                    <div className="episode-title">Episode {i + 1}</div>
                    <div className="episode-duration">44m</div>
                    <div className="episode-desc">
                      {selectedVideo.description}
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
            {selectedVideo.quizzes.length > 0 ? (
              <div className="quiz-list">
                {selectedVideo.quizzes.map((quiz) => (
                  <div className="quiz-item" key={quiz.id}>
                    <h5>{quiz.title || "Untitled Quiz"}</h5>
                    <div className="quiz-meta">
                      <span>{quiz.questions?.length || "0"} questions</span>
                      <span>{quiz.duration || "No time limit"}</span>
                    </div>
                    <button 
                      onClick={() => handlePlayQuiz(quiz.id)} 
                      className="start-quiz-btn"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content-message">
                <p>No quizzes available for this video</p>
              </div>
            )}
          </div>
        );
      case "Assignment":
        return (
          <div className="assignment-content">
            <h4>Assignments</h4>
            {selectedVideo.assignments.length > 0 ? (
              <div className="assignment-list">
                {selectedVideo.assignments.map((assignment) => (
                  <div className="assignment-item" key={assignment.id}>
                    <h5>{assignment.title || "Untitled Assignment"}</h5>
                    <div className="assignment-meta">
                      <span>Description: {assignment.description || "None provided"}</span>
                      <span>Category: {assignment.category || "General"}</span>
                      <span>Due: {assignment.due_date || "No deadline"}</span>
                    </div>
                    <button 
                      className="view-assignment-btn"
                      onClick={() => handleViewAssignment(assignment.id)}
                    >
                      View Assignment
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content-message">
                <p>No assignments available for this video</p>
                <button 
                  className="refresh-btn"
                  onClick={() => window.location.reload()}
                >
                  Refresh Data
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="netflix-container">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
          <p>Loading content...</p>
        </div>
      )}
      
      {error && (
        <Alert variant="danger" className="error-alert">
          {error}
          <button 
            className="retry-btn" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </Alert>
      )}

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
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    onError={(e) => {
                      e.target.src = "/default-thumbnail.jpg";
                    }}
                  />
                  <span className="video-quality">{video.quality || "HD"}</span>
                </div>
              </Card>

              {hoveredVideo === video.id && (
                <div className="netflix-hover-card">
                  <div className="hover-thumbnail">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      onError={(e) => {
                        e.target.src = "/default-thumbnail.jpg";
                      }}
                    />
                  </div>
                  <div 
                  
                    className="hover-details"
                  >
                    <div className="action-buttons d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <button
                          className="action-btn"
                          onClick={(e) => handlePlayClick(video.id, e)}
                        >
                          <FaPlay />
                        </button>
                        <button className="action-btn">
                          <FaPlus />
                        </button>
                        <button className="action-btn">
                          <FaThumbsUp />
                        </button>
                      </div>
                      <button 
                        className="action-btn more-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedVideo(video.id);
                        }}
                      >
                        <FaChevronDown />
                      </button>
                    </div>
                    <div className="match-rating">
                      <span className="match">{video.match || "98% Match"}</span>
                      <span className="age-rating">{video.rating || "PG-13"}</span>
                      <span>{video.seasons || "1 Season"}</span>
                      <span className="hd-badge">{video.quality || "HD"}</span>
                    </div>
                    <div className="genre-tags">
                      {video.genres.map((genre, index) => (
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
          
          className={`expanded-video-popup ${isFadingOut ? "fade-out" : ""}`}
        >
          <div className="popup-header">
            <img 
              src={selectedVideo.thumbnail_url} 
              alt={selectedVideo.title} 
              className="banner-image"
              onError={(e) => {
                e.target.src = "/default-banner.jpg";
              }}
            />
            <IoMdCloseCircleOutline 
              className="close-btn" 
              onClick={handleClose} 
            />
          </div>

          <div className="popup-content mx-auto">
            <div className="metadata">
              <span className="match">{selectedVideo.match || "98% Match"}</span>
              <span className="year">{selectedVideo.year || "2022"}</span>
              <span className="rating">{selectedVideo.rating || "PG-13"}</span>
              <span className="seasons">{selectedVideo.seasons || "1 Season"}</span>
              <span className="genres">
                {selectedVideo.genres.join(", ") || "General"}
              </span>
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