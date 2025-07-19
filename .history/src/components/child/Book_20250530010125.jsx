import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./VideoThumbnails.css";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const [hoveredBook, setHoveredBook] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { color: themeColor, textColor } = useTheme();
  const navigate = useNavigate();


  const [activeTab, setActiveTab] = useState("pdf");

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setExpandedBook(null);
      setIsFadingOut(false);
    }, 300);
  };

  const BookData = [
    {
      id: 1,
      thumbnailUrl:
        "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
      title: "THE RECRUIT",
      match: "95% Match",
      rating: "TV-MA",
      seasons: "2 Seasons",
      quality: "HD",
      pdf: [
        { id: 1, title: "Chapter 1 pdf", questions: 10, duration: "15 min" },
        { id: 2, title: "Midterm pdf", questions: 20, duration: "30 min" },
      ],
      quizzes: [
        { id: 1, title: "Chapter 1 Quiz", questions: 10, duration: "15 min" },
        { id: 2, title: "Midterm Quiz", questions: 20, duration: "30 min" },
      ],
      assignments: [
        { id: 1, title: "Essay Assignment", due: "May 30", points: 100 },
        { id: 2, title: "Group Project", due: "June 15", points: 200 },
      ],
      genres: ["pdf", "quiz", "assignment"],
      description:
        "A young CIA lawyer gets entangled in dangerous international conspiracies when a former asset threatens to expose agency secrets.",
    },
    {
      id: 2,
      thumbnailUrl:
        "https://m.media-amazon.com/images/M/MV5BODIyNzk5NDg5M15BMl5BanBnXkFtZTgwMTE5NjA5MjI@._V1_.jpg",
      title: "STRANGER THINGS",
      match: "98% Match",
      rating: "TV-14",
      seasons: "4 Seasons",
      quality: "4K",
      genres: ["pdf", "quiz", "assignment"],
      description:
        "When a boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.",
    },
    {
      id: 3,
      thumbnailUrl:
        "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
      title: "THE RECRUIT",
      match: "95% Match",
      rating: "TV-MA",
      seasons: "2 Seasons",
      quality: "HD",
      genres: ["pdf", "quiz", "assignment"],
      description:
        "A young CIA lawyer gets entangled in dangerous international conspiracies when a former asset threatens to expose agency secrets.",
    },
    {
      id: 4,
      thumbnailUrl:
        "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
      title: "THE RECRUIT",
      match: "95% Match",
      rating: "TV-MA",
      seasons: "2 Seasons",
      quality: "HD",
      genres: ["pdf", "quiz", "assignment"],
      description:
        "A young CIA lawyer gets entangled in dangerous international conspiracies when a former asset threatens to expose agency secrets.",
    },
    {
      id: 5,
      thumbnailUrl:
        "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
      title: "THE RECRUIT",
      match: "95% Match",
      rating: "TV-MA",
      seasons: "2 Seasons",
      quality: "HD",
      genres: ["pdf", "quiz", "assignment"],
      description:
        "A young CIA lawyer gets entangled in dangerous international conspiracies when a former asset threatens to expose agency secrets.",
    },
  ];

  const selectedBook = BookData.find((v) => v.id === expandedBook);

  useEffect(() => {
    document.body.style.overflow = expandedBook ? "hidden" : "auto";
  }, [expandedBook]);

  const renderTabContent = () => {
    if (!selectedBook) return null;

    switch (activeTab.toLowerCase) {
      case "pdf":
        return (
          <div className="quiz-content">
            <h4>PDF</h4>
            <div className="quiz-list">
              {(selectedBook.quizzes || []).map((quiz) => (
                <div className="quiz-item" key={quiz.id}>
                  <h5>{quiz.title}</h5>
                  <div className="quiz-meta">
                    <span>{quiz.questions} questions</span>
                    <span>{quiz.duration}</span>
                  </div>
                  <button
                    className="start-quiz-btn"
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "quiz":
        return (
          <div className="quiz-content">
            <h4>Quizzes</h4>
            <div className="quiz-list">
              {(selectedBook.quizzes || []).map((quiz) => (
                <div className="quiz-item" key={quiz.id}>
                  <h5>{quiz.title}</h5>
                  <div className="quiz-meta">
                    <span>{quiz.questions} questions</span>
                    <span>{quiz.duration}</span>
                  </div>
                  <button className="start-quiz-btn">Start Quiz</button>
                </div>
              ))}
            </div>
          </div>
        );
      case "assignment":
        return (
          <div className="assignment-content">
            <h4>Assignments</h4>
            <div className="assignment-list">
              {(selectedBook.assignments || []).map((assignment) => (
                <div className="assignment-item" key={assignment.id}>
                  <h5>{assignment.title}</h5>
                  <div className="assignment-meta">
                    <span>Due: {assignment.due}</span>
                    <span>Points: {assignment.points}</span>
                  </div>
                  <button className="view-assignment-btn">
                    View Assignment
                  </button>
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
    <Container className="netflix-container">
      <Row className="thumbnails-row">
        {BookData.map((video) => (
          <Col
            key={video.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            className="thumbnail-col"
            onMouseEnter={() => setHoveredBook(video.id)}
            onMouseLeave={() => setHoveredBook(null)}
            onClick={() => setExpandedBook(video.id)}
          >
            <div className="netflix-card-wrapper-book">
              <Card className="netflix-thumbnail-book">
                <div className="thumbnail-image-container-book">
                  <img src={video.thumbnailUrl} alt={video.title} />
                  <span className="Book-quality">{video.quality}</span>
                </div>
              </Card>

              {hoveredBook === video.id && (
                <div
                  style={{ backgroundColor: themeColor, color: textColor }}
                  className="netflix-hover-card-book"
                >
                  <div className="hover-thumbnail">
                    <img src={video.thumbnailUrl} alt={video.title} />
                  </div>
                  <div className="hover-details">
                    <div className="action-buttons d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <button className="action-btn">
                          <FaPlus />
                        </button>
                        <button className="action-btn">
                          <FaThumbsUp />
                        </button>
                      </div>
                      <button
                        className="action-btn more-btn"
                        onClick={() => setExpandedBook(video.id)}
                      >
                        <FaChevronDown />
                      </button>
                    </div>
                    <div className="match-rating">
                      <span className="match">{video.match}</span>
                      <span className="age-rating">{video.rating}</span>
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

      {selectedBook && (
        <div
          style={{ backgroundColor: themeColor, color: textColor }}
          className={`expanded-video-popup ${isFadingOut ? "fade-out" : ""}`}
        >
          <div className="popup-header">
            <img
              src={selectedBook.thumbnailUrl}
              alt={selectedBook.title}
              className="banner-image"
            />
            <IoMdCloseCircleOutline
              className="close-btn"
              onClick={handleClose}
            />
          </div>

          <div
            style={{ backgroundColor: themeColor, color: textColor }}
            className="popup-content mx-auto"
          >
            <div className="metadata">
              <span className="match">{selectedBook.match}</span>
              <span className="year">2022</span>
              <span className="rating">{selectedBook.rating}</span>
              <span className="seasons">{selectedBook.seasons}</span>
              <span className="genres">{selectedBook.genres.join(", ")}</span>
            </div>

            <p className="description">{selectedBook.description}</p>

            {/* Tab Navigation */}
            <div className="language-tabs">
              <div className="tab-buttons">
                {["PDF", "Quiz", "Assignment"].map((tab) => (
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

export default Book;
