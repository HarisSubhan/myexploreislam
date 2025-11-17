import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import "../../../components/child/ChildProfilePage.css";
import { getModuleApi } from "../../../services/moduleApi";

const ChildDashboard = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getModuleApi();

        const formattedModules = data.map((module) => {
          const baseUrl =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

          const thumbnail = module.thumbnail_url
            ? module.thumbnail_url.startsWith("http")
              ? module.thumbnail_url
              : new URL(module.thumbnail_url, baseUrl).href
            : null;

          return {
            id: module.id,
            title: module.name,
            thumbnail,
          };
        });

        setModules(formattedModules);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
        if (err.message.includes("401")) {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleCardClick = () => {
    navigate("/child/"); // Static path for all cards
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (
    unauthorized ||
    error?.includes("session has expired") ||
    error?.includes("No authentication")
  ) {
    return (
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #e0f7fa, #fff3e0)",
        }}
      >
        <div
          className="p-4 rounded"
          style={{
            background: "white",
            maxWidth: "500px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 className="text-danger mb-4">
            <FaSignInAlt className="me-2" />
            Session Expired
          </h3>
          <p className="mb-4">
            {error || "Your session has expired. Please login to continue."}
          </p>
          <Button variant="primary" onClick={handleLoginRedirect} size="lg">
            Go to Login
          </Button>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="alert alert-danger text-center mx-auto"
          style={{ maxWidth: "500px" }}
        >
          {error}
        </div>
      </Container>
    );
  }

  if (modules.length === 0) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="alert alert-info text-center mx-auto"
          style={{ maxWidth: "500px" }}
        >
          No learning modules available right now. Please check back later.
        </div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center py-4"
      style={{
        background: "linear-gradient(to bottom right, #e0f7fa, #fff3e0)",
        minHeight: "100vh",
      }}
    >
      <h2 className="text-center fw-bold mb-4" style={{ color: "#0d6efd" }}>
        Welcome to Your Learning World!
      </h2>

      <Row className="g-4 justify-content-center align-items-center">
        {modules.map((module) => (
          <Col key={module.id} xs={12} sm={8} md={6} lg={4} xl={3}>
            <Card
              onClick={handleCardClick} // Same handler for all cards
              style={{
                cursor: "pointer",
                borderRadius: "16px",
                overflow: "hidden",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              className="h-100"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              {module.thumbnail ? (
                <img
                  src={module.thumbnail}
                  alt={module.title}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/default-thumb.png";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  }}
                >
                  {module.title}
                </div>
              )}

              <Card.Body>
                <h5 className="fw-bold mb-0">{module.title}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ChildDashboard;
