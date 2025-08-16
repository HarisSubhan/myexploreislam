// import React, { useState, useEffect } from "react";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import AdminLayout from "../../AdminApp";
// import { uploadVideoApi } from "../../../../services/videoApi";
// import { useNavigate } from "react-router-dom";
// import { getCategoriesApi } from "../../../../services/categoryApi";


// const AddVideo = () => {
//   const navigate = useNavigate();
//   const [videoType, setVideoType] = useState("single");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   // const [category, setCategory] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);
//   const [singleVideo, setSingleVideo] = useState(null);
//   const [seriesVideos, setSeriesVideos] = useState([]);
//   // const [categories, setCategories] = useState([]);


//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getCategoriesApi();
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     // formData.append("category", category);
//     formData.append("thumbnail", thumbnail);

//     if (videoType === "single") {
//       formData.append("video", singleVideo);
//     } else {
//       for (let i = 0; i < seriesVideos.length; i++) {
//         formData.append("video", seriesVideos[i]);
//       }
//     }

//     try {
//       await uploadVideoApi(formData);
//       alert("Video uploaded successfully!");
//       navigate("/admin/videos");
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Failed to upload video.");
//     }
//   };

//   return (
//     <AdminLayout>
//       <Container>
//         <h3 className="my-4">Add New Video</h3>
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   required
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   required
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </Form.Group>

//               {/* <Form.Group className="mb-3">
//                 <Form.Label>Category</Form.Label>
//                 <Form.Select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.name}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group> */}

//               <Form.Group className="mb-3">
//                 <Form.Label>Thumbnail</Form.Label>
//                 <Form.Control
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setThumbnail(e.target.files[0])}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Video Type</Form.Label>
//                 <Form.Select
//                   value={videoType}
//                   onChange={(e) => setVideoType(e.target.value)}
//                 >
//                   <option value="single">Single</option>
//                   <option value="series">Series</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               {videoType === "single" ? (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Upload Video (Single)</Form.Label>
//                   <Form.Control
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => setSingleVideo(e.target.files[0])}
//                     required
//                   />
//                 </Form.Group>
//               ) : (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Upload Videos (Series)</Form.Label>
//                   <Form.Control
//                     type="file"
//                     accept="video/*"
//                     multiple
//                     onChange={(e) => setSeriesVideos(e.target.files)}
//                     required
//                   />
//                 </Form.Group>
//               )}
//             </Col>
//           </Row>

//           <Button type="submit" variant="danger">
//             Upload Video
//           </Button>
//         </Form>
//       </Container>
//     </AdminLayout>
//   );
// };

// export default AddVideo;



import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { uploadVideoApi } from "../../../../services/videoApi";
import { useNavigate } from "react-router-dom";
import { getSeriesApi } from "../../../../services/seriesApi"; // ✅ New Series API import

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

  // Fetch series list
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await getSeriesApi();
        setSeriesList(response.data);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };
    fetchSeries();
  }, []);

  // Submit form
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
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              {/* Description */}
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

              {/* Thumbnail */}
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

              {/* Series Dropdown - Only show if videoType is "series" */}
              {videoType === "series" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Series</Form.Label>
                  <Form.Select
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                    required
                  >
                    <option value="">-- Select a Series --</option>
                    {seriesList.map((series) => (
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
                    onChange={(e) => setSeriesVideos(e.target.files)}
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
