import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, Card, Form, Col, Row, 
  Container, Modal, Image, OverlayTrigger,
  Tooltip, Popover
} from 'react-bootstrap';
import { 
  FaCamera, FaSave, FaUndo, FaPalette, 
  FaSmile, FaUserEdit, FaCheck 
} from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import '../../../components/child/ChildProfilePage.css'; 
import { useUser } from "../../../context/UserContext";



const ChildProfilePage = () => {
    const { user } = useUser();
      const [username, setUsername] = useState("Explorer");
      useEffect(() => {
          if (user && user.name) {
            setUsername(user.name);
          }
        }, [user]);
    
  
  // const [profile, setProfile] = useState({
  //   name: 'Super Kid',
  //   age: 8,
  //   favoriteColor: '#ff6b6b',
  //   avatar: '👦',
  //   avatarType: 'emoji',
  //   bio: 'I love playing and learning new things!'
  // });
  
  const [isEditing, setIsEditing] = useState(false);

  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);
  

  const emojis = ['👦', '👧', '🧒', '👶', '🦸', '🧙', '🧚', '🐱', '🐶', '🦊'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarClick = () => {
    if (profile.avatarType === 'photo') return;
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setProfile(prev => ({ ...prev, avatar: randomEmoji }));
  };
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => ({
          ...prev,
          avatar: event.target.result,
          avatarType: 'photo'
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const toggleAvatarType = () => {
    setProfile(prev => ({
      ...prev,
      avatarType: prev.avatarType === 'emoji' ? 'photo' : 'emoji',
      avatar: prev.avatarType === 'emoji' ? emojis[0] : ''
    }));
    if (profile.avatarType === 'photo') {
      fileInputRef.current.value = '';
    }
  };
  
  const saveProfile = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  

  return (
    <Container fluid className="profile-container" 
      >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="profile-card">
            <Card.Header className="profile-header">
              <Card.Title>
                {isEditing ? 'Edit Your Profile' : 'My Awesome Profile'}
              </Card.Title>
              {!isEditing && (
                <Button 
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                >
                  <FaUserEdit /> Edit
                </Button>
              )}
            </Card.Header>
            
            <Card.Body>
              <div className="avatar-section">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Click to change!</Tooltip>}
                >
                  <div 
                    className={`avatar ${profile.avatarType}`}
                    onClick={isEditing ? handleAvatarClick : null}
                  >
                    {profile.avatarType === 'emoji' ? (
                      <span className="emoji-avatar">{profile.avatar}</span>
                    ) : (
                      profile.avatar ? 
                        <Image src={profile.avatar} roundedCircle /> : 
                        <FaCamera className="camera-icon" />
                    )}
                  </div>
                </OverlayTrigger>
                
                {isEditing && (
                  <div className="avatar-controls mt-3">
                    <Button 
                      variant="info"
                      onClick={toggleAvatarType}
                      className="me-2"
                    >
                      {profile.avatarType === 'emoji' ? 
                        <><FaCamera /> Use Photo</> : 
                        <><FaSmile /> Use Emoji</>}
                    </Button>
                    
                    {profile.avatarType === 'photo' && (
                      <>
                        <Form.Control
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/*"
                          id="photo-upload"
                          className="d-none"
                        />
                        <Button 
                          as="label"
                          htmlFor="photo-upload"
                          variant="secondary"
                        >
                          Upload Photo
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>My Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="name-input"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>My Age:</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={profile.age}
                      onChange={handleChange}
                      min="1"
                      max="12"
                      className="age-input"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>About Me:</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="bio-input"
                      rows={3}
                    />
                  </Form.Group>
                  
                
                  
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button 
                      variant="success"
                      onClick={saveProfile}
                      className="save-button"
                    >
                      <FaSave /> Save
                    </Button>
                    <Button 
                      variant="warning"
                      onClick={() => setIsEditing(false)}
                    >
                      <FaUndo /> Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="profile-details text-center">
                  <Card.Title className="profile-name">{profile.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted profile-age">
                    Age: {profile.age}
                  </Card.Subtitle>
                  <Card.Text className="profile-bio">{profile.bio}</Card.Text>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Modal show={saved} onHide={() => setSaved(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Yay! <GiPartyPopper /></Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <FaCheck className="text-success mb-3" style={{ fontSize: '3rem' }} />
          <h4>Your profile has been saved!</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setSaved(false)}>
            Awesome!
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ChildProfilePage;