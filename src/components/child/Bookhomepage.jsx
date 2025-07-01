import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import Slider from "react-slick";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../../services/bookApi"; // Make sure this path is correct

const BookHomepage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks();
        console.log("Books fetched:", data);
        setBooks(data || []);
      } catch (err) {
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);
  
  

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button className="slick-arrow slick-next" onClick={onClick} style={{ right: "-25px", zIndex: 1, background: "transparent", border: "none", fontSize: "24px", color: "#000" }}>
        <MdNavigateNext />
      </button>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button className="slick-arrow slick-prev" onClick={onClick} style={{ left: "-25px", zIndex: 1, background: "transparent", border: "none", fontSize: "24px", color: "#000" }}>
        <MdNavigateBefore />
      </button>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Container className="trending-now-section my-5" style={{ position: "relative" }}>
      <h2 className="mb-3">All Books</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Slider {...settings}>
          {books.map((book) => (
            <div key={book._id} className="px-2">
              <Card className="h-100" style={{ height: "500px" }}>
                <div
                  onClick={() => navigate(`/child/book/${book._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    src={book.image || "https://via.placeholder.com/250x350.png?text=No+Image"}
                    alt={book.title}
                    style={{
                      height: "250px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{book.title}</Card.Title>
                  <Card.Text
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.description || "No description available"}
                  </Card.Text>
                  <Button
                    onClick={() => navigate(`/child/book/${book._id}`)}
                    variant="primary"
                    className="mt-auto"
                  >
                    More Detail
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
