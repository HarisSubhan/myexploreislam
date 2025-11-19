import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Container,
  Image,
} from "react-bootstrap";
import "../../../components/child/ChildProfilePage.css";
import { useUser } from "../../../context/UserContext";
import { getUserChildDataApi } from "../../../services/api";

const ChildProfilePage = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    avatar: "👦",
    avatarType: "emoji",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        setLoading(true);
        if (user && user.id) {
          const childData = await getUserChildDataApi(user.id);
          setProfile(childData);
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching child data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [user]);

  const emojis = ["👦", "👧", "🧒", "👶", "🦸", "🧙", "🧚", "🐱", "🐶", "🦊"];

  if (loading) {
    return (
      <Container fluid className="profile-container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="profile-card">
              <Card.Body className="text-center">
                <div className="loading-spinner">Loading...</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="profile-container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="profile-card">
              <Card.Body className="text-center">
                <div className="error-message text-danger">{error}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="profile-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="profile-card">
            <Card.Header
              style={{ backgroundColor: "red" }}
              className="profile-header"
            >
              <Card.Title>My Awesome Profile</Card.Title>
            </Card.Header>

            <Card.Body>
              <div className="avatar-section">
                <div className={`avatar ${profile.avatarType}`}>
                  {profile.avatarType === "emoji" ? (
                    <span className="emoji-avatar">{profile.avatar}</span>
                  ) : profile.avatar ? (
                    <Image src={profile.avatar} roundedCircle />
                  ) : (
                    <span className="emoji-avatar">{emojis[0]}</span>
                  )}
                </div>
              </div>

              <div className="profile-details text-center">
                <Card.Title className="profile-name">
                  {profile.name || "Explorer"}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted profile-age">
                  Age: {profile.age || "Not specified"}
                </Card.Subtitle>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChildProfilePage;