import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaPlay, FaHeart, FaRegClock, FaEye } from "react-icons/fa";
import { getAllVideosApi } from "../../services/videoApi"; 
import "../../components/child/VideoThumbnails.css";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const { color: themeColor, textColor } = useTheme();
  
  const handleClick = () => {
    navigate(`/child/video/${video.id}`);
  };

  return (
    <Card
      className="child-video-card border-0 shadow-sm"
      onClick={handleClick}
      style={{ 
        cursor: "pointer",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.2s",
        backgroundColor: "#f9f9f9"
      }}
    >
      <div className="position-relative">
        <div className="thumbnail-container">
          <Card.Img 
            variant="top" 
            src={video.thumbnail_url} 
            className="child-thumbnail"
          />
          <div className="play-icon-overlay">
            <FaPlay size={24} />
          </div>
        </div>
        <div className="video-badges">
          <Badge pill className="age-badge">
            {video.ageGroup || "3+"} 
          </Badge>
          <Badge 
            pill 
            className="duration-badge"
            style={{ backgroundColor: themeColor, color: textColor }}
          >
            {video.duration || "3:00"}
          </Badge>
        </div>
      </div>
      <Card.Body className="pt-2 px-2 pb-3">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="child-video-title">
            {video.title}
          </Card.Title>
          <button 
            className="favorite-button"
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite toggle
            }}
          >
            <FaHeart color={video.favorite ? "#ff6b6b" : "#ccc"} />
          </button>
        </div>
        <Card.Text className="video-description">
          {video.description}
        </Card.Text>
        <div className="video-meta d-flex align-items-center">
          <span className="meta-item">
            <FaEye className="meta-icon" /> {video.views || "1M views"}
          </span>
          <span className="meta-divider">•</span>
          <span className="meta-item">
            <FaRegClock className="meta-icon" /> {video.time || "1 day ago"}
          </span>
        </div>
        <Badge pill className="category-badge">
          {video.category}
        </Badge>
      </Card.Body>
    </Card>
  );
};

const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="category-filter mb-4">
      {categories.map(category => (
        <button
          key={category}
          className={`category-button ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export const VideoHomepage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract unique categories from videos
  const categories = ["All", ...new Set(videos.map(video => video.category))];

  const filteredVideos = activeCategory === "All" 
    ? videos 
    : videos.filter(video => video.category === activeCategory);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAllVideosApi();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">Error loading videos: {error}</div>
      </Container>
    );
  }

  return (
    <Container className="child-video-container py-4">
      <h2 className="child-page-title mb-4">Kids Videos</h2>
      
      <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filteredVideos.map((video) => (
          <Col key={video.id}>
            <VideoCard video={video} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VideoCard;