import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import Slider from "react-slick";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaBookOpen, FaStar, FaFilePdf } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { baseUrl } from "../../services/config";
import "../../components/child/VideoThumbnails.css";
import { getAllBooks } from "../../services/bookApi";

const BookHomepage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks(); 

        const formattedBooks = data.map((book) => ({
          ...book,
          image: book.thumbnail_url
            ? `${baseUrl}${book.thumbnail_url}`
            : "/default-book-cover.png",
          pdfUrl: book.file_url ? `${baseUrl}${book.file_url}` : "#",
          description:
            book.description ||
            `${book.title} by ${book.author} | ${book.pages || "N/A"} pages`,
        }));

        setBooks(formattedBooks);
      } catch (err) {
        setError(err.message || "Failed to load books");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Slider configuration
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  const NextArrow = (props) => (
    <button {...props} className="slick-arrow slick-next">
      <MdNavigateNext />
    </button>
  );

  const PrevArrow = (props) => (
    <button {...props} className="slick-arrow slick-prev">
      <MdNavigateBefore />
    </button>
  );

  const renderStars = (rating = Math.floor(Math.random() * 5) + 1) => (
    <div className="book-rating">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />
      ))}
    </div>
  );

  return (
   <Container className="book-carousel-section my-5">
  <h2 className="section-title text-center text-primary fw-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
    📚 Explore Our Magical Book Collection!
  </h2>

  {loading ? (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Loading magical books...</p>
    </div>
  ) : error ? (
    <Alert variant="danger" className="my-4">{error}</Alert>
  ) : books.length === 0 ? (
    <Alert variant="info" className="my-4">No books found right now 🧐</Alert>
  ) : (
    <Slider {...settings} nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
      {books.map((book) => (
        <div key={book._id} className="px-2">
          <Card className="h-100 border-0 shadow rounded-4 book-card-hover">
            <div className="position-relative">
              <Card.Img
                variant="top"
                src={book.image}
                alt={book.title}
                className="book-cover-img"
                style={{
                  height: "240px",
                  objectFit: "cover",
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem"
                }}
                onError={(e) => {
                  e.target.src = "/default-book-cover.png";
                  e.target.onerror = null;
                }}
              />
              {book.category && (
                <span className="badge bg-warning position-absolute top-0 end-0 m-2 shadow-sm">
                  🎯 {book.category}
                </span>
              )}
            </div>
            <Card.Body className="text-center">
              <Card.Title className="fw-bold" style={{ fontFamily: "'Comic Neue', cursive" }}>
                {book.title}
              </Card.Title>
              <div className="small text-muted mb-1">{book.author}</div>
              <div>{renderStars()}</div>
              <Card.Text className="small mt-2" style={{ fontStyle: "italic" }}>
                {book.description}
              </Card.Text>
              <Button
                variant="success"
                size="sm"
                className="mt-2 w-100 rounded-pill fw-bold"
                onClick={() => window.open(book.pdfUrl, "_blank")}
              >
                📖 Let's Read!
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Slider>
  )}
</Container>

  );
};

export default BookHomepage;