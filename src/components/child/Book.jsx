import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../../services/bookApi";
import "./VideoThumbnails.css";


import { baseUrl } from "../../services/config";

const Book = () => {
  const [hoveredBook, setHoveredBook] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { color: themeColor, textColor } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("pdf");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks();
        setBooks(data.map(book => ({
          ...book,
         
          thumbnailUrl: `${baseUrl}${book.thumbnail_url}`,
          match: "95% Match", 
          rating: "Book", 
          seasons: `${book.pages} Pages`,
          quality: "HD",
          pdf: [
            { id: 1, title: "Full Book PDF", questions: 0, duration: "N/A" }
          ],
          quizzes: [], 
          assignments: [], 
          genres: [book.category || "General"],
          description: book.description || "No description available"
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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

  const selectedBook = books.find((v) => v.id === expandedBook);

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
                  <a 
                    href={`${baseUrl}${selectedBook.file_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="start-quiz-btn"
                  >
                    View PDF
                  </a>
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
              {selectedBook.quizzes?.length === 0 && (
                <p>No quizzes available for this book</p>
              )}
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
              {selectedBook.assignments?.length === 0 && (
                <p>No assignments available for this book</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <div className="alert alert-danger">Error: {error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="netflix-container">
      <Row className="thumbnails-row">
        {books.slice(0, 5).map((book) => (
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
                    loading="lazy"
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