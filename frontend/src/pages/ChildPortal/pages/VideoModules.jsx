import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaBookOpen, FaGamepad, FaMusic } from "react-icons/fa";
import cartoonImage from "@images/c.png";
import { getCategoriesApi } from "@/services/categoryApi"; 

const VideoModules = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const iconMap = [
    { icon: <FaPlay size={28} className="text-white" />, bgColor: "#FF6B6B" },
    {
      icon: <FaBookOpen size={28} className="text-white" />,
      bgColor: "#4ECDC4",
    },
    {
      icon: <FaGamepad size={28} className="text-white" />,
      bgColor: "#3A86FF",
    },
    { icon: <FaMusic size={28} className="text-white" />, bgColor: "#FFBE0B" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesApi();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCardClick = (category) => {
    const slug = category.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/child/videos/${slug}`);
  };


  return (
    <Container
      fluid
      className="py-5"
      style={{
        background: "linear-gradient(to bottom right, #e0f7fa, #fff3e0)",
        minHeight: "100vh",
      }}
    >
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#0d6efd" }}>
        Islamic Cartoon World
      </h2>

      <Row className="g-4 justify-content-center">
        {categories.map((cat, index) => {
          const { icon, bgColor } = iconMap[index % iconMap.length]; // rotate icons if more than 4
          return (
            <Col key={index} xs={12} sm={8} md={6} lg={4} xl={3}>
              <Card
                onClick={() => handleCardClick(cat)}
                className="h-100 border-0 text-center overflow-hidden"
                style={{
                  borderRadius: "20px",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: bgColor,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    zIndex: 2,
                  }}
                >
                  {icon}
                </div>

                <div
                  style={{
                    height: "200px",
                    backgroundImage: `url(${cartoonImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    }}
                  />
                </div>

                <Card.Body
                  className="pb-4"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <h5
                    className="mt-3 mb-0 fw-bold"
                    style={{
                      color: "#333",
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {cat.name}
                  </h5>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default VideoModules;
