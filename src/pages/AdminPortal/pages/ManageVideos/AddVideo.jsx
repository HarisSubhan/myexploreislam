import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { uploadVideoApi } from "../../../../services/videoApi";
import { useNavigate } from "react-router-dom";

const AddVideo = () => {
  const navigate = useNavigate();
  const [videoType, setVideoType] = useState("single");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [singleVideo, setSingleVideo] = useState(null);
  const [seriesVideos, setSeriesVideos] = useState([]);

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
      alert("🚧 Series upload is not yet supported.");
      return;
      // Later: loop through seriesVideos and append each video
      // for (let i = 0; i < seriesVideos.length; i++) {
      //   formData.append("videos", seriesVideos[i]);
      // }
    }

    try {
      await uploadVideoApi(formData);
      alert("✅ Video uploaded successfully!");
      navigate("/admin/videos");
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Failed to upload video.");
    }
  };

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
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  required
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
                    required
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
                    required
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
