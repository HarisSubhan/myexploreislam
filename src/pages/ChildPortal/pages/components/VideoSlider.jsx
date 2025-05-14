import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./VideoThumbnails.css";

const VideoThumbnails = () => {
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setExpandedVideo(null);
      setIsFadingOut(false);
    }, 300); // match fade-out duration
  };

  const videoData = [
    {
      id: 1,
      thumbnailUrl:
        "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
      title: "THE RECRUIT",
      match: "95% Match",
      rating: "TV-MA",
      seasons: "2 Seasons",
      quality: "HD",
      genres: ["Action", "Thriller", "Drama"],
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
      genres: ["Sci-Fi", "Horror", "Drama"],
      description:
        "When a boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.",
    },
  ];

  const selectedVideo = videoData.find((v) => v.id === expandedVideo);

  useEffect(() => {
    document.body.style.overflow = expandedVideo ? "hidden" : "auto";
  }, [expandedVideo]);

  return (
    <Container fluid className="netflix-container">
      <Row className="thumbnails-row">
        {videoData.map((video) => (
         <Col
         key={video.id}
         xs={12}
         sm={6}
         md={4}
         lg={3}
         xl={2}
         className="thumbnail-col"
         onMouseEnter={() => setHoveredVideo(video.id)}
         onMouseLeave={() => setHoveredVideo(null)}
         onClick={() => setExpandedVideo(video.id)}
       >
       
            <div className="netflix-card-wrapper">
              <Card className="netflix-thumbnail">
                <div className="thumbnail-image-container">
                  <img src={video.thumbnailUrl} alt={video.title} />
                  <span className="video-quality">{video.quality}</span>
                </div>
              </Card>

              {hoveredVideo === video.id && (
                <div className="netflix-hover-card">
                  <div className="hover-thumbnail">
                    <img src={video.thumbnailUrl} alt={video.title} />
                  </div>
                  <div className="hover-details">
                    <div className="action-buttons d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <button className="action-btn play-btn">
                          <FaPlay />
                        </button>
                        <button className="action-btn">
                          <FaPlus />
                        </button>
                        <button className="action-btn">
                          <FaThumbsUp />
                        </button>
                      </div>
                      <button
                        className="action-btn more-btn"
                        onClick={() => setExpandedVideo(video.id)}

                      >
                        <FaChevronDown />
                      </button>
                    </div>
                    <div className="match-rating">
                      <span className="match">{video.match}</span>
                      <span className="age-rating">{video.rating}</span>
                      <span>{video.seasons}</span>
                      <span className="hd-badge">{video.quality}</span>
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

      {selectedVideo && (
        <div
          className={`expanded-video-popup ${isFadingOut ? "fade-out" : ""}`}
        >
          <div className="popup-header">
            <img
              src={selectedVideo.thumbnailUrl}
              alt={selectedVideo.title}
              className="banner-image"
            />
            <IoMdCloseCircleOutline
              className="close-btn"
              onClick={handleClose}
            />
          </div>

          <div className="popup-content">
            <div className="metadata">
              <span className="match">{selectedVideo.match}</span>
              <span className="year">2022</span>
              <span className="rating">{selectedVideo.rating}</span>
              <span className="seasons">{selectedVideo.seasons}</span>
              <span className="genres">{selectedVideo.genres.join(", ")}</span>
            </div>

            <p className="description">{selectedVideo.description}</p>

            <div className="episodes-header">
              <h4>Episodes</h4>
              <select className="season-selector">
                <option>Season 1 (10 EP)</option>
              </select>
            </div>

            <div className="episodes-list">
              {[...Array(10)].map((_, i) => (
                <div className="episode" key={i}>
                  <div className="episode-thumb">
                    <img
                      src={selectedVideo.thumbnailUrl}
                      alt={`Episode ${i + 1}`}
                    />
                  </div>
                  <div className="episode-details">
                    <div className="episode-title">Episode {i + 1}</div>
                    <div className="episode-duration">44m</div>
                    <div className="episode-desc">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default VideoThumbnails;
