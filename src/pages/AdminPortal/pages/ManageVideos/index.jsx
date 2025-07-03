import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/videos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` // Optional: add token if protected
        }
      })
      .then((res) => {
        setVideos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch videos", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (confirmDelete) {
      axios
        .delete(`/api/videos/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then(() => {
          setVideos(videos.filter((video) => video.id !== id));
        })
        .catch((err) => {
          console.error("Failed to delete video", err);
        });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">🎬 Manage Videos</h2>

        <Link to="/admin/manage-videos/add">
          <Button variant="success" className="mb-3">➕ Add New Video</Button>
        </Link>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Video Title</th>
                <th>Category</th>
                <th>Video URL</th>
                <th>Thumbnail</th>
                <th>Uploaded On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
                <tr key={video.id}>
                  <td>{index + 1}</td>
                  <td>{video.title}</td>
                  <td>{video.category}</td>
                  <td>
                    <a href={video.video_url} target="_blank" rel="noreferrer">Watch</a>
                  </td>
                  <td>
                    <img
                      src={video.thumbnail_url}
                      alt="Thumbnail"
                      width="80"
                      height="50"
                    />
                  </td>
                  <td>{new Date(video.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/manage-videos/view/${video.id}`}>
                      <Button variant="info" size="sm" className="me-2">View</Button>
                    </Link>
                    <Link to={`/admin/manage-videos/edit/${video.id}`}>
                      <Button variant="warning" size="sm" className="me-2">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageVideos;
