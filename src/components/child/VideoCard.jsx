import React from "react";
import { Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/child/video/${video.id}`);
  };

  return (
    <Card
      className="border-0"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="position-relative">
        <Card.Img variant="top" src={video.thumbnail} />
        <Badge
          className="position-absolute bottom-0 end-0 m-2"
          style={{ backgroundColor: "#dc3545", color: "#fff", opacity: 0.85 }}
        >
          {video.duration}
        </Badge>
      </div>
      <Card.Body className="pt-2 px-1">
        <Card.Title style={{ fontSize: "0.95rem" }}>{video.title}</Card.Title>
        <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
          {video.channel}
          <br />
          {video.views} • {video.time}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default VideoCard;
