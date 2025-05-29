// // src/pages/ChildPortal/pages/VideoDetail.js
// import React from "react";
// import { useParams } from "react-router-dom";

// const VideoDetail = () => {
//   const { videoId } = useParams();

//   return (
//     <div className="p-4">
//       <h2>Video Details for ID: {videoId}</h2>
//       {/* Add more detailed content here */}
//     </div>
//   );
// };

// export default VideoDetail;
// src/pages/ChildPortal/pages/VideoDetail.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

// Dummy video data (same as in Videohomepage)
const videos = [
  {
    id: 1,
    title: "Kaho Na Kaho slowed reverb (lofi)",
    channel: "Harshit Saxena",
    views: "1.2M views",
    time: "2 days ago",
    duration: "3:20",
    thumbnail: "https://picsum.photos/id/237/800/450",
  },
  {
    id: 2,
    title: "Main Nagin Dance Full Video",
    channel: "Anmol Malik",
    views: "42M views",
    time: "Updated today",
    duration: "4:05",
    thumbnail: "https://picsum.photos/id/238/800/450",
  },
  {
    id: 3,
    title: "Sason ki Mala Pe (Remix)",
    channel: "Nusrat Fateh Ali Khan",
    views: "900K views",
    time: "1 week ago",
    duration: "4:42",
    thumbnail: "https://picsum.photos/id/239/800/450",
  },
  {
    id: 4,
    title: "Nasha - Lofi Song",
    channel: "Tamannaah B",
    views: "3M views",
    time: "1 month ago",
    duration: "3:24",
    thumbnail: "https://picsum.photos/id/240/800/450",
  },
  {
    id: 5,
    title: "Build Apps with GenAI",
    channel: "OpenAI",
    views: "2.3M views",
    time: "3 days ago",
    duration: "2:01",
    thumbnail: "https://picsum.photos/id/241/800/450",
  },
];

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  // Convert videoId to number and find the video
  const video = videos.find((v) => v.id === parseInt(videoId));

  if (!video) {
    return (
      <Container className="p-4">
        <h4>Video not found</h4>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="p-4">
      <Row>
        <Col md={8}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="img-fluid rounded mb-3"
          />
          <h3>{video.title}</h3>
          <p className="text-muted">
            {video.views} • {video.time}
          </p>
          <p>
            <strong>Channel:</strong> {video.channel}
          </p>
          <p>
            <strong>Duration:</strong> {video.duration}
          </p>
        </Col>
        <Col md={4}>
          {/* Optional: Add suggested videos, ads, etc. */}
          <h5>Up Next</h5>
          <ul className="list-unstyled">
            {videos
              .filter((v) => v.id !== video.id)
              .map((v) => (
                <li key={v.id} style={{ marginBottom: "1rem", cursor: "pointer" }} onClick={() => navigate(`/child/video/${v.id}`)}>
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="img-fluid rounded"
                    style={{ width: "100%" }}
                  />
                  <p className="mb-0 mt-1">{v.title}</p>
                  <small className="text-muted">{v.channel}</small>
                </li>
              ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoDetail;
