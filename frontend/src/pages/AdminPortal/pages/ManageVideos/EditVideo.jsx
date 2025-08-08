import React, { useEffect, useState } from "react";
import AdminLayout from "../../AdminApp";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing video data
  useEffect(() => {
    axios.get(`/api/videos/${id}`)
      .then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category
        });
      })
      .catch((err) => {
        alert("Failed to fetch video data.");
      });
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);

    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (video) formData.append("video", video);

    try {
      await axios.put(`/api/videos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Video updated successfully!");
      navigate("/admin/videos");
    } catch (err) {
      console.error(err);
      alert("Failed to update video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h3 className="my-4">✏️ Edit Video (ID: {id})</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Thumbnail (optional)</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Video (optional)</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Video"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditVideo;
