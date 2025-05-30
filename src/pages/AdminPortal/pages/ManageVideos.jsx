import React from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../AdminApp";

const dummyVideos = [
  {
    id: 1,
    title: "Importance of Salah",
    category: "Prayer",
    duration: "5:32",
    uploadedBy: "Admin",
  },
  {
    id: 2,
    title: "Stories of the Prophets",
    category: "Stories",
    duration: "12:10",
    uploadedBy: "Admin",
  },
  {
    id: 3,
    title: "What is Islam?",
    category: "Aqidah",
    duration: "8:45",
    uploadedBy: "Admin",
  },
];

const ManageVideos = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">🎬 Manage Videos</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Video Title</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Uploaded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyVideos.map((video, index) => (
              <tr key={video.id}>
                <td>{index + 1}</td>
                <td>{video.title}</td>
                <td>{video.category}</td>
                <td>{video.duration}</td>
                <td>{video.uploadedBy}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    View
                  </Button>
                  <Button variant="warning" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ManageVideos;
