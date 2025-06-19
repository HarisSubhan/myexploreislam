// import React, { useState } from 'react';
// import { Form, Button, Card } from 'react-bootstrap';

// const AddVideo = () => {
//   const [title, setTitle] = useState('');
//   const [url, setUrl] = useState('');
//   const [category, setCategory] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({ title, url, category });
//     // Later: send this data to backend
//     alert('Video added successfully!');
//     setTitle('');
//     setUrl('');
//     setCategory('');
//   };

//   return (
//     <Card className="p-4">
//       <h3 className="mb-4">🎬 Add New Video</h3>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3">
//           <Form.Label>Video Title</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Video URL</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter URL"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Category</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Button variant="danger" type="submit">
//           ➕ Add Video
//         </Button>
//       </Form>
//     </Card>
//   );
// };

// export default AddVideo;


import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import AdminLayout from "../../AdminApp";

const AddVideo = () => {
  const [videoType, setVideoType] = useState("single");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [singleVideo, setSingleVideo] = useState(null);
  const [seriesVideos, setSeriesVideos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan API call karni hogi to actually save video data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("thumbnail", thumbnail);
    formData.append("videoType", videoType);

    if (videoType === "single") {
      formData.append("video", singleVideo);
    } else {
      for (let i = 0; i < seriesVideos.length; i++) {
        formData.append("seriesVideos", seriesVideos[i]);
      }
    }

    console.log("Video submitted!");
    // axios.post("/api/videos", formData)
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
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category"
                />
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
