import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Tab,
  Form,
  ProgressBar,
  Badge,
  InputGroup,
} from "react-bootstrap";
import {
  FiBook,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiSearch,
} from "react-icons/fi";
import { BsEmojiSmile, BsClipboardCheck } from "react-icons/bs";
import "../../../components/child/VideoThumbnails.css";
import { useTheme } from "../../../context/ThemeContext";
import { getAllAssignments } from "../../../../"; // 👈 API

const AssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignments, setAssignments] = useState({
    current: [],
    completed: [],
  });
  const { color: themeColor, textColor } = useTheme();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAllAssignments();

        // Separate completed and current
        const current = data.filter((a) => !a.completed); // Adjust if no "completed" in DB
        const completed = data.filter((a) => a.completed); // Use if you store "completed" flag

        setAssignments({ current, completed });
      } catch (err) {
        console.error("Failed to fetch assignments:", err.message);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = (assignments[activeTab] || []).filter(
    (a) =>
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchTerm.toLowerCase()) // Changed subject -> category
  );

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={6}>
          <h2
            style={{ backgroundColor: themeColor, color: textColor }}
            className="d-flex align-items-center gap-2"
          >
            <BsClipboardCheck size={28} />
            My Assignments
          </h2>
        </Col>
        <Col xs={12} md={6} className="mt-3 mt-md-0">
          <InputGroup>
            <InputGroup.Text className="bg-light">
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search fun assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "0 25px 25px 0" }}
            />
          </InputGroup>
        </Col>
      </Row>

      <Tabs
        style={{
          border: "3px solid #4a6fa5",
          borderRadius: "20px",
          padding: "10px",
          background: "#fefefe",
        }}
        id="assignments-tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="mb-4 child-tabs"
        variant="pills"
        justify
      >
        <Tab eventKey="current" title={<span>📝 To Do</span>} />
        <Tab eventKey="completed" title={<span>✅ Done</span>} />
      </Tabs>

      {filteredAssignments.length === 0 ? (
        <div className="text-center my-5">
          <img
            src="/images/no-assignments.png"
            alt="No assignments"
            width="120"
            className="mb-3"
          />
          <h4 className="text-warning">No {activeTab} assignments!</h4>
          {activeTab === "current" && <p>Yay! 🎉 You’re free to play!</p>}
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4 mb-4">
          {filteredAssignments.map((assignment) => (
            <Col key={assignment.id}>
              <Card
                className="shadow-sm"
                style={{
                  borderLeft: `8px solid ${
                    assignment.category === "Math"
                      ? "#FF6B6B"
                      : assignment.category === "Science"
                        ? "#4ECDC4"
                        : "#FFD166"
                  }`,
                  borderRadius: "20px",
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <Badge bg="light" text="dark" className="rounded-pill px-3">
                      {assignment.category}
                    </Badge>
                    <Badge bg="danger">
                      <FiCalendar className="me-1" />
                      {assignment.due_date?.slice(0, 10)}
                    </Badge>
                  </div>
                  <Card.Title style={{ fontSize: "1.1rem" }}>
                    {assignment.title}
                  </Card.Title>
                  <Card.Text
                    className="text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {assignment.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-primary fw-bold">
                      <FiAward className="me-1" />
                      {assignment.points || 10} pts
                    </span>
                    <Button
                      variant="warning"
                      size="sm"
                      className="rounded-pill px-3"
                    >
                      Start Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Card className="bg-light mt-4 border-0 rounded-4 shadow-sm">
        <Card.Body>
          <h5 className="text-success">🌟 Your Progress</h5>
          <ProgressBar
            now={75}
            label="3 of 4"
            variant="success"
            className="my-2"
            style={{ height: "20px", borderRadius: "10px" }}
          />
          <p className="mb-0 text-muted">
            Great job! Keep going! <BsEmojiSmile />
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AssignmentsPage;
