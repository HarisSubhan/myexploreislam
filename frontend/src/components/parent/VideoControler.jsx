import React, { useState } from "react";
import { Table, Button, Form, Dropdown } from "react-bootstrap";

const VideoController = () => {
  const [selectedChild, setSelectedChild] = useState("");
  const [videos, setVideos] = useState([
    { id: 1, age: 8, video: "Learning Colors", checked: false },
    { id: 2, age: 10, video: "Math Basics", checked: false },
    { id: 3, age: 12, video: "Science for Kids", checked: false },
  ]);

  const handleSelectChild = (child) => {
    setSelectedChild(child);
  };

  const handleCheckboxChange = (id) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v))
    );
  };

  const handleSave = () => {
    const selectedVideos = videos.filter((v) => v.checked);
    console.log("Selected Child:", selectedChild);
    console.log("Selected Videos:", selectedVideos);
    alert("Data saved successfully!");
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Video Controller</h3>

      {/* Child Dropdown */}
      <div className="mb-4">
        <Dropdown onSelect={handleSelectChild}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {selectedChild || "Select Child"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="Ali">Ali</Dropdown.Item>
            <Dropdown.Item eventKey="Sara">Sara</Dropdown.Item>
            <Dropdown.Item eventKey="Ahmed">Ahmed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Video Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: "60px" }}>Select</th>
            <th>Age</th>
            <th>Video</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((v) => (
            <tr key={v.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={v.checked}
                  onChange={() => handleCheckboxChange(v.id)}
                />
              </td>
              <td>{v.age}</td>
              <td>{v.video}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Save Button */}
      <div className="text-end mt-3">
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default VideoController;
