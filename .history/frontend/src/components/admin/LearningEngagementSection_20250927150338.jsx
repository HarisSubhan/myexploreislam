import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Tab, Nav } from "react-bootstrap";
import LearningPerformance from "./LearningPerformance";
import EngagementTrends from "./EngagementTrends";
import TopContent from "./TopContent";

const LearningEngagementSection = () => {
  const [learningData, setLearningData] = useState({
    avgQuizScore: 0,
    assignmentCompletion: 0,
    courseCompletion: 0,
  });

  const [engagementData, setEngagementData] = useState({
    dauMauRatio: 0,
    avgSessionDuration: 0,
    peakUsage: [],
  });

  const [contentData, setContentData] = useState({
    topContent: [],
    leastEngaged: [],
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const fetchData = async () => {
      setLearningData({
        avgQuizScore: 78.5,
        assignmentCompletion: 65.2,
        courseCompletion: 42.8,
      });

      setEngagementData({
        dauMauRatio: 0.35,
        avgSessionDuration: 24.7, // minutes
        peakUsage: [
          { hour: "8-9", usage: 45 },
          { hour: "9-10", usage: 68 },
          { hour: "10-11", usage: 72 },
          { hour: "11-12", usage: 65 },
          { hour: "12-13", usage: 58 },
          { hour: "13-14", usage: 63 },
          { hour: "14-15", usage: 70 },
          { hour: "15-16", usage: 75 },
          { hour: "16-17", usage: 82 },
          { hour: "17-18", usage: 78 },
          { hour: "18-19", usage: 65 },
          { hour: "19-20", usage: 55 },
        ],
      });

      setContentData({
        topContent: [
          {
            id: 1,
            title: "Math Fundamentals",
            type: "Course",
            views: 1247,
            completion: 85,
          },
          {
            id: 2,
            title: "Science Experiments",
            type: "Video",
            views: 987,
            completion: 92,
          },
          {
            id: 3,
            title: "Reading Comprehension",
            type: "Course",
            views: 856,
            completion: 78,
          },
          {
            id: 4,
            title: "Creative Writing",
            type: "Video",
            views: 743,
            completion: 88,
          },
          {
            id: 5,
            title: "Basic Coding",
            type: "Course",
            views: 689,
            completion: 81,
          },
        ],
        leastEngaged: [
          {
            id: 6,
            title: "Advanced Algebra",
            type: "Course",
            views: 234,
            completion: 32,
          },
          {
            id: 7,
            title: "History Timeline",
            type: "Video",
            views: 189,
            completion: 28,
          },
          {
            id: 8,
            title: "Grammar Rules",
            type: "Course",
            views: 156,
            completion: 25,
          },
          {
            id: 9,
            title: "Physics Concepts",
            type: "Video",
            views: 143,
            completion: 30,
          },
          {
            id: 10,
            title: "Geography Quiz",
            type: "Course",
            views: 98,
            completion: 22,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <Container fluid className="learning-engagement-section">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">Learning & Engagement Analytics</h2>
          <p className="section-subtitle">
            Education outcomes and user activity metrics
          </p>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="learning">
        <Card>
          <Card.Header>
            <Nav variant="tabs" className="section-tabs">
              <Nav.Item>
                <Nav.Link eventKey="learning">Learning Performance</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="engagement">Engagement Trends</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="content">Top Content</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="learning">
                <LearningPerformance data={learningData} />
              </Tab.Pane>

              <Tab.Pane eventKey="engagement">
                <EngagementTrends data={engagementData} />
              </Tab.Pane>

              <Tab.Pane eventKey="content">
                <TopContent data={contentData} />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
};

export default LearningEngagementSection;
