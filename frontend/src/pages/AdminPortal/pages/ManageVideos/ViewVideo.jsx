// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card, Spinner } from "react-bootstrap";
// import AdminLayout from "../../AdminApp";

// // Dummy data temporarily (replace with real API later)
// const dummyVideos = [
//   {
//     id: 1,
//     title: "Importance of Salah",
//     category: "Prayer",
//     duration: "5:32",
//     description: "This video explains why Salah is important in a Muslim's life.",
//     videoUrl: "https://www.youtube.com/embed/VKf7NNKZgTg"
//   },
//   {
//     id: 2,
//     title: "Stories of the Prophets",
//     category: "Stories",
//     duration: "12:10",
//     description: "An inspiring story from the life of Prophet Yusuf (A.S).",
//     videoUrl: "https://www.youtube.com/embed/PKlhbGTVSbY"
//   }
// ];

// const ViewVideo = () => {
//   const { id } = useParams();
//   const [video, setVideo] = useState(null);

//   useEffect(() => {
//     // Replace this with real API call:
//     const found = dummyVideos.find((v) => v.id === parseInt(id));
//     setVideo(found);
//   }, [id]);

//   if (!video) {
//     return (
//       <AdminLayout>
//         <div className="p-4 text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <div className="p-4">
//         <h2 className="mb-4">🎥 View Video Details</h2>
//         <Card>
//           <Card.Body>
//             <h4>{video.title}</h4>
//             <p><strong>Category:</strong> {video.category}</p>
//             <p><strong>Duration:</strong> {video.duration}</p>
//             <p><strong>Description:</strong> {video.description}</p>

//             <div className="mt-4">
//               <iframe
//                 width="100%"
//                 height="400"
//                 src={video.videoUrl}
//                 title={video.title}
//                 frameBorder="0"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           </Card.Body>
//         </Card>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ViewVideo;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import axios from "axios";

const ViewVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Error fetching video:", error);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!video) {
    return (
      <AdminLayout>
        <div className="p-4 text-center text-danger">
          <h5>Video not found!</h5>
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
            <p><strong>Description:</strong> {video.description}</p>

            <div className="mb-3">
              <img
                src={`http://localhost:5000${video.thumbnail_url}`}
                alt="Thumbnail"
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
              />
            </div>

            <div>
              <video
                controls
                style={{ width: "100%", maxHeight: "400px" }}
              >
                <source src={`http://localhost:5000${video.video_url}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Card.Body>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewVideo;
