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
import avatar1 from "../../../assets/add-child-avatar/avatar1.png";


import defaultAvatar from "../../../assets/add-child-avatar/default.png";

const ChildProfilePage = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map avatar names from backend to imported images
  const avatarImages = {
    avatar1: avatar1,
    default: defaultAvatar
  };

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

  // Get the correct avatar image based on profile.avatar from backend
  const getAvatarImage = () => {
    const avatarKey = profile.avatar || 'default';
    return avatarImages[avatarKey] || avatarImages.default;
  };

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
                <div className="avatar">
                  <Image 
                    src={getAvatarImage()} 
                    roundedCircle 
                    className="profile-avatar-image"
                    alt={profile.name || "Child Avatar"}
                  />
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