import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaBookOpen, FaPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const BookBanner = () => {
  const navigate = useNavigate(); 


  const goToBooks = () => {
    navigate("/child/book");
  };

  const goToVideos = () => {
    navigate("/child/videos");
  };

  return (
    <Container fluid className="px-0 mb-5">
      <div
        className="px-4 text-white position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6e45e2 0%, #88d3ce 100%)",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          minHeight: "500px",
          paddingTop: "4rem",
          paddingBottom: "4rem"
        }}
      >
        {/* Decorative elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-20">
          <div
            className="position-absolute rounded-circle"
            style={{
              top: "10%",
              left: "20%",
              width: "100px",
              height: "100px",
              background: "rgba(255, 255, 0, 0.4)",
              filter: "blur(30px)"
            }}
          ></div>
          <div
            className="position-absolute rounded-circle"
            style={{
              bottom: "5%",
              right: "20%",
              width: "120px",
              height: "120px",
              background: "rgba(0, 255, 200, 0.4)",
              filter: "blur(30px)"
            }}
          ></div>
        </div>

        <Container>
          <Row className="align-items-center" style={{ minHeight: "500px" }}>
            <Col md={7} className="d-flex flex-column justify-content-center">
              <h1
                className="display-4 fw-bold mb-3"
                style={{
                  fontFamily: "'Comic Neue', cursive",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
                }}
              >
                Discover <span style={{ color: "#FFD700" }}>Magical</span> Stories!
              </h1>

              <p className="lead mb-4" style={{ fontSize: "1.5rem" }}>
                Where every book opens a door to new adventures and imagination!
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  variant="warning"
                  size="lg"
                  className="rounded-pill fw-bold px-4 py-3 d-flex align-items-center"
                  style={{ boxShadow: "0 4px 15px rgba(255, 215, 0, 0.4)" }}
                  onClick={goToBooks} // ✅ Navigate to books
                >
                  <FaBookOpen className="me-2" />
                  Explore Books
                </Button>

                <Button
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill fw-bold px-4 py-3 d-flex align-items-center"
                  onClick={goToVideos} // ✅ Navigate to videos or any route
                >
                  <FaPlayCircle className="me-2" />
                  Story Time
                </Button>
              </div>
            </Col>

            <Col md={5} className="d-none d-md-block position-relative">
              <div className="position-relative" style={{ height: "400px" }}>
                <div
                  className="position-absolute bottom-0 start-0 bg-warning"
                  style={{
                    width: "180px",
                    height: "220px",
                    borderRadius: "15px",
                    transform: "rotate(10deg)",
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.2)"
                  }}
                ></div>
                <div
                  className="position-absolute bottom-0 start-30 bg-danger"
                  style={{
                    width: "180px",
                    height: "220px",
                    borderRadius: "15px",
                    transform: "rotate(-5deg)",
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.2)",
                    left: "30px"
                  }}
                ></div>
                <div
                  className="position-absolute bottom-0 start-60 bg-white d-flex justify-content-center align-items-center"
                  style={{
                    width: "180px",
                    height: "220px",
                    borderRadius: "15px",
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.2)",
                    left: "60px"
                  }}
                >
                  <span className="display-3" role="img" aria-label="books">
                    📚
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
};

export default BookBanner;
