import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import "./VideoThumbnails.css";

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
    // ... other book data
  ];

  const selectedBook = BookData.find((v) => v.id === expandedBook);

  useEffect(() => {
    document.body.style.overflow = expandedBook ? "hidden" : "auto";
  }, [expandedBook]);

  const renderTabContent = () => {
    if (!selectedBook) return null;

    switch (activeTab.toLowerCase()) {
      case "pdf":
        return (
          <div className="quiz-content">
            <h4>PDF</h4>
            <div className="quiz-list">
              {(selectedBook.pdf || []).map((pdf) => (
                <div className="quiz-item" key={pdf.id}>
                  <h5>{pdf.title}</h5>
                  <div className="quiz-meta">
                    <span>{pdf.questions} questions</span>
                    <span>{pdf.duration}</span>
                  </div>
                  <button className="start-quiz-btn">
                    View PDF
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
        {BookData.map((book) => (
          <Col
            key={book.id}
            xs={6}
            sm={4}
            md={3}
            lg={2}
            className="thumbnail-col"
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
            onClick={() => setExpandedBook(book.id)}
          >
            <div className="netflix-card-wrapper-book">
              <Card className="netflix-thumbnail-book">
                <div className="thumbnail-image-container-book">
                  <img 
                    src={book.thumbnailUrl} 
                    alt={book.title} 
                    loading="lazy" // Add lazy loading
                  />
                  <span className="book-quality">{book.quality}</span>
                </div>
              </Card>

              {hoveredBook === book.id && (
                <div
                  style={{ backgroundColor: themeColor, color: textColor }}
                  className="netflix-hover-card-book"
                >
                  <div className="hover-thumbnail">
                    <img src={book.thumbnailUrl} alt={book.title} />
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedBook(book.id);
                        }}
                      >
                        <FaChevronDown />
                      </button>
                    </div>
                    <div className="match-rating">
                      <span className="match">{book.match}</span>
                      <span className="age-rating">{book.rating}</span>
                    </div>
                    <div className="genre-tags">
                      {book.genres.map((genre, index) => (
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

            <div className="language-tabs">
              <div className="tab-buttons">
                {["PDF", "Quiz", "Assignment"].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab.toLowerCase() ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.toLowerCase())}
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