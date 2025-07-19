import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { getCategoriesApi } from "../../../../services/api";

const AddVideo = () => {
  const [videoType, setVideoType] = useState("single");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [singleVideo, setSingleVideo] = useState(null);
  const [seriesVideos, setSeriesVideos] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("thumbnail", thumbnail);
  
    if (videoType === "single") {
      formData.append("video", singleVideo);
    } else {
      for (let i = 0; i < seriesVideos.length; i++) {
        formData.append("video", seriesVideos[i]); // still append as "video" for backend
      }
    }
  
    try {
      const res = await axios.post("/api/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert(res.data.message || "Video uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("Failed to upload video");
    }
  };
  

  useEffect (()=>{
    getCategoriesApi().then(res => setCategories(res.data))
    .catch(err =>console.err('category fetch error:', err))
  },[]);

  return (
    <AdminLayout>
      <Container>
        <h3 className="my-4">🎬 Add New Video</h3>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
  <option value="">-- Select Category --</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</Form.Select>

              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Video Type</Form.Label>
                <Form.Select
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="series">Series</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              {videoType === "single" ? (
                <Form.Group className="mb-3">
                  <Form.Label>Upload Video (Single)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={(e) => setSingleVideo(e.target.files[0])}
                  />
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Upload Videos (Series)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => setSeriesVideos(e.target.files)}
                  />
                </Form.Group>
              )}
            </Col>
          </Row>

          <Button type="submit" variant="danger">
            🚀 Upload Video
          </Button>
        </Form>
      </Container>
    </AdminLayout>
  );
};

export default AddVideo;
