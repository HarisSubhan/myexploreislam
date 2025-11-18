import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { uploadVideoApi } from "../../../../services/videoApi";
import { useNavigate } from "react-router-dom";
import { getSeriesApi } from "../../../../services/seriesApi";

const AddVideo = () => {
  const navigate = useNavigate();

  const [videoType, setVideoType] = useState("single");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [singleVideo, setSingleVideo] = useState(null);
  const [seriesVideos, setSeriesVideos] = useState([]);
  const [seriesList, setSeriesList] = useState([]); 
  const [seriesId, setSeriesId] = useState("");

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await getSeriesApi();
        console.log("Series API response:", response);

        const seriesData = Array.isArray(response) ? response : response.data;
        setSeriesList(seriesData || []); 
      } catch (error) {
        console.error("Error fetching series:", error);
        setSeriesList([]); 
      }
    };
    fetchSeries();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);

    if (videoType === "series") {
      formData.append("series_id", seriesId);
      for (let i = 0; i < seriesVideos.length; i++) {
        formData.append("video", seriesVideos[i]);
      }
    } else {
      formData.append("video", singleVideo);
    }

    try {
      await uploadVideoApi(formData);
      alert("Video uploaded successfully!");
      navigate("/admin/videos");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload video.");
    }
  };

  return (
    <AdminLayout>
      <Container>
        <h3 className="my-4">Add New Video</h3>
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
                <Form.Label>Age</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={age}
                  onChange={(e) => setDescription(e.target.value)}
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

              {/* Video Type */}
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

           
              {videoType === "series" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Series</Form.Label>
                  <Form.Select
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                    required
                  >
                    <option value="">-- Select a Series --</option>
                    
                    {seriesList?.map((series) => (
                      <option key={series.id} value={series.id}>
                        {series.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
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
                    onChange={(e) =>
                      setSeriesVideos(Array.from(e.target.files))
                    }
                    required
                  />
                </Form.Group>
              )}
            </Col>
          </Row>

          <Button type="submit" variant="danger">
            Upload Video
          </Button>
        </Form>
      </Container>
    </AdminLayout>
  );
};

export default AddVideo;
