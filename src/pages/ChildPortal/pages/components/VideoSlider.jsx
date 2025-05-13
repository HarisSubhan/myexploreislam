import React, { useState } from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';


function VideoThumbnails() {
  const videoData = [
    { id: 1, thumbnailUrl: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg', title: 'Video Title 1', fullImageUrl: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg' }, // Added fullImageUrl
    { id: 2, thumbnailUrl: 'https://static.vecteezy.com/system/resources/previews/044/281/246/non_2x/open-book-on-a-table-with-stacks-of-books-on-the-sides-blurred-modern-library-on-a-background-photo.jpg', title: 'Video Title 2', fullImageUrl: 'https://static.vecteezy.com/system/resources/previews/044/281/246/non_2x/open-book-on-a-table-with-stacks-of-books-on-the-sides-blurred-modern-library-on-a-background-photo.jpg' },
    { id: 3, thumbnailUrl: 'https://thumb.photo-ac.com/1e/1e7fe1eb725877048cea73b0fc7726d9_t.jpeg', title: 'Video Title 3', fullImageUrl: 'https://thumb.photo-ac.com/1e/1e7fe1eb725877048cea73b0fc7726d9_t.jpeg' },
    { id: 4, thumbnailUrl: 'https://st.depositphotos.com/1000152/4981/i/450/depositphotos_49813215-stock-photo-school-books.jpg', title: 'Video Title 4', fullImageUrl: 'https://st.depositphotos.com/1000152/4981/i/450/depositphotos_49813215-stock-photo-school-books.jpg' },
    { id: 5, thumbnailUrl: 'https://st.depositphotos.com/1000152/4981/i/450/depositphotos_49813215-stock-photo-school-books.jpg', title: 'Video Title 5', fullImageUrl: 'https://st.depositphotos.com/1000152/4981/i/450/depositphotos_49813215-stock-photo-school-books.jpg' },
  ];

  const [hoveredVideo, setHoveredVideo] = useState(null);

  const handleMouseEnter = (video) => {
    setHoveredVideo(video);
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
  };

  return (
    <Container fluid>
      <Row>
        {videoData.slice(0, 5).map((video) => (
          <Col key={video.id} xs={12} sm={6} md={4} lg={true} className="mb-4 position-relative">
            <Card
              className="h-100 thumbnail-card"
              onMouseEnter={() => handleMouseEnter(video)}
              onMouseLeave={handleMouseLeave}
            >
              <Card.Img
                variant="top"
                src={video.thumbnailUrl}
                alt={video.title}
                className="thumbnail-image"
                style={{ objectFit: 'cover', height: '200px' }}
              />
              {hoveredVideo && hoveredVideo.id === video.id && (
                <div className="on-image-popup-container">
                  <img
                    src={hoveredVideo.fullImageUrl} // Use the full image URL
                    alt={hoveredVideo.title}
                    className="popup-image"
                    style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain' }}
                  />
                  <p className="popup-title">{hoveredVideo.title}</p>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default VideoThumbnails;