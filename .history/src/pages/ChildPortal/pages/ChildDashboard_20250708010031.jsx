import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import VideoSlider from "../../../components/child/VideoSlider";
import Book from "../../../components/child/Book";
import { FaBookOpen, FaVideo, FaStar, FaTrophy } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Banner from "../../../components/child/Banner";
import FallingElements from "./FallingElements";
import { useUser } from "../../../context/UserContext";


const styles = {
  dashboard: {
    backgroundColor: "#FFF8F0",
    minHeight: "100vh",
    padding: "1rem 0.5rem",
    backgroundImage: "url('/images/background-pattern.png')",
    backgroundSize: "cover",
  },
  welcomeCard: {
    backgroundColor: "#FF9E7D",
    borderRadius: "16px",
    border: "3px dashed #FFF",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  titleText: {
    fontFamily: "'Baloo 2', cursive",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    color: "#FFF",
  },
  statCard: (backgroundColor) => ({
    backgroundColor,
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
    minHeight: "120px",
    '&:hover': {
      transform: "scale(1.02)",
    },
  }),
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: "16px",
    border: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  contentBox: {
    backgroundColor: "#FFF8F0",
    borderRadius: "12px",
    padding: "12px",
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)",
  },
  iconCircle: {
    width: "clamp(40px, 10vw, 60px)",
    height: "clamp(40px, 10vw, 60px)",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const progressData = {
  booksRead: 12,
  videosWatched: 8,
  starsEarned: 45,
  currentLevel: 3,
};

const StatCard = ({ icon: Icon, value, label, color, bgColor, onClick }) => (
  <Col xs={6} md={6}>
    <Card
      className="h-100 text-center stats-card"
      onClick={onClick}
      style={styles.statCard(bgColor)}
    >
      <Card.Body className="d-flex flex-column justify-content-center p-3">
        <div style={styles.iconCircle}>
          <Icon size={20} color={color} />
        </div>
        <h3
          className="fw-bold mb-0 mb-md-1"
          style={{
            fontFamily: "'Baloo 2', cursive",
            color,
            fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
          }}
        >
          {value}
        </h3>
        <p
          className="mb-0"
          style={{
            fontFamily: "'Baloo 2', cursive",
            color,
            fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
          }}
        >
          {label}
        </p>
      </Card.Body>
    </Card>
  </Col>
);

const SectionHeader = ({ icon: Icon, title, description, iconBgColor }) => (
  <>
    <div className="d-flex align-items-center mb-2 mb-md-3">
      <div
        className="section-icon me-2 me-md-3"
        style={{
          width: "clamp(40px, 10vw, 50px)",
          height: "clamp(40px, 10vw, 50px)",
          backgroundColor: iconBgColor,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={20} color="#FFF" />
      </div>
      <h2
        className="fs-5 fs-md-4 mb-0"
        style={{
          color: "#023047",
          fontFamily: "'Baloo 2', cursive",
        }}
      >
        {title}
      </h2>
    </div>
    <p
      className="text-muted small mb-2 mb-md-3"
      style={{ fontFamily: "'Baloo 2', cursive" }}
    >
      {description}
    </p>
  </>
);

const ChildDashboard = () => {
  const { color: themeColor } = useTheme();
  const { user, loading, error } = useUser();
  const [username, setUsername] = useState("Explorer");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.name) {
      setUsername(user.name);
    }
  }, [user]);

  const navigateToBooks = () => navigate("/child/book");
  const navigateToVideos = () => navigate("/child/video");

  return (
    <div>
      <FallingElements />
      <Banner />
    <div className="child-dashboard" style={styles.dashboard}>
      <Container fluid className="px-2 px-sm-3 px-md-4">
        {/* Welcome & Progress */}
        <Row className="mb-3 mb-md-4">
          <Col>
            <Card className="welcome-card" style={styles.welcomeCard}>
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="text-center text-md-start mb-3 mb-md-0">
                    <h1
                      className="fw-bold mb-1 mb-md-2"
                      style={{
                        ...styles.titleText,
                        fontSize: "clamp(1.5rem, 4vw, 2rem)",
                      }}
                    >
                      👋 Hello, Super Learner!
                    </h1>
                    <p
                      className="mb-0"
                      style={{
                        ...styles.titleText,
                        fontSize: "clamp(0.9rem, 2vw, 1rem)",
                      }}
                    >
                      You're doing amazing! Keep it up!
                    </p>
                  </div>
                  <div>
                    <div
                      className="child-avatar"
                      style={{
                        width: "clamp(60px, 15vw, 80px)",
                        height: "clamp(60px, 15vw, 80px)",
                        borderRadius: "50%",
                        backgroundColor: "#FFD166",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "3px solid #FFF",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <span style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>😊</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="progress-container mt-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span
                      style={{
                        fontFamily: "'Baloo 2', cursive",
                        color: "#FFF",
                        fontSize: "clamp(0.9rem, 2vw, 1rem)",
                      }}
                    >
                      Level {progressData.currentLevel}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Baloo 2', cursive",
                        color: "#FFF",
                        fontSize: "clamp(0.9rem, 2vw, 1rem)",
                      }}
                    >
                      <FaStar color="#FFD700" /> {progressData.starsEarned}
                    </span>
                  </div>
                  <div
                    className="progress"
                    style={{
                      height: "14px",
                      borderRadius: "7px",
                      backgroundColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{
                        width: "65%",
                        backgroundColor: "#FFD166",
                        borderRadius: "7px",
                      }}
                      aria-valuenow="65"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="mb-3 mb-md-4 g-2">
          <StatCard
            icon={FaBookOpen}
            value={progressData.booksRead}
            label="Books Read"
            color="#023047"
            bgColor="#A2D2FF"
            onClick={navigateToBooks}
          />
          <StatCard
            icon={FaVideo}
            value={progressData.videosWatched}
            label="Videos Watched"
            color="#023047"
            bgColor="#FFAFCC"
            onClick={navigateToVideos}
          />
        </Row>

        {/* Book Section */}
        <Row className="mb-3 mb-md-4">
          <Col>
            <Card className="section-card h-100" style={styles.sectionCard}>
              <Card.Body className="p-3 p-md-4">
                <SectionHeader
                  icon={FaBookOpen}
                  title="Your Adventure Books"
                  description="Discover magical stories and learn new things!"
                  iconBgColor="#FFB703"
                />
                <div style={styles.contentBox}>
                  <Book />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Video Section */}
        <Row className="mb-3 mb-md-4">
          <Col>
            <Card className="section-card h-100" style={styles.sectionCard}>
              <Card.Body className="p-3 p-md-4">
                <SectionHeader
                  icon={FaVideo}
                  title="Fun Learning Videos"
                  description="Watch, learn, and have fun with our video collection!"
                  iconBgColor="#219EBC"
                />
                <div style={styles.contentBox}>
                  <VideoSlider />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Achievement Section */}
        <Row>
          <Col>
            <Card
              className="achievement-card"
              style={{
                backgroundColor: "#FFD166",
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Card.Body className="text-center p-3 py-md-4">
                <FaTrophy size={32} className="mb-2 mb-md-3" color="#023047" />
                <h4
                  className="fw-bold mb-2 mb-md-3"
                  style={{ 
                    fontFamily: "'Baloo 2', cursive", 
                    color: "#023047",
                    fontSize: "clamp(1rem, 2.5vw, 1.25rem)"
                  }}
                >
                  You earned a new badge!
                </h4>
                <button
                  className="btn btn-primary px-3 py-1 px-md-4 py-md-2 rounded-pill"
                  style={{
                    backgroundColor: "#EF476F",
                    border: "none",
                    fontFamily: "'Baloo 2', cursive",
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                  }}
                >
                  View Achievements
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </div>
    
  );
};

export default ChildDashboard;