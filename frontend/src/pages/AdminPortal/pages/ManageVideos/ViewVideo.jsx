import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import AdminLayout from "../../AdminApp";

// Dummy data temporarily (replace with real API later)
const dummyVideos = [
  {
    id: 1,
    title: "Importance of Salah",
    category: "Prayer",
    duration: "5:32",
    description: "This video explains why Salah is important in a Muslim's life.",
    videoUrl: "https://www.youtube.com/embed/VKf7NNKZgTg"
  },
  {
    id: 2,
    title: "Stories of the Prophets",
    category: "Stories",
    duration: "12:10",
    description: "An inspiring story from the life of Prophet Yusuf (A.S).",
    videoUrl: "https://www.youtube.com/embed/PKlhbGTVSbY"
  }
];

const ViewVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // Replace this with real API call:
    const found = dummyVideos.find((v) => v.id === parseInt(id));
    setVideo(found);
  }, [id]);

  if (!video) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">🎥 View Video Details</h2>
        <Card>
          <Card.Body>
            <h4>{video.title}</h4>
            <p><strong>Category:</strong> {video.category}</p>
            <p><strong>Duration:</strong> {video.duration}</p>
            <p><strong>Description:</strong> {video.description}</p>

            <div className="mt-4">
              <iframe
                width="100%"
                height="400"
                src={video.videoUrl}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewVideo;
