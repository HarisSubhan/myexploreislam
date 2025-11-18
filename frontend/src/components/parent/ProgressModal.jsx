// components/ProgressModal.js
import React from "react";
import { Modal, Row, Col, Button, Badge, ProgressBar, Image } from "react-bootstrap";

const ProgressModal = ({ show, onHide, child }) => {
  if (!child) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      aria-labelledby="progress-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="progress-modal">Progress — {child.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={4} className="text-center">
            {child.avatar ? (
              <div className="position-relative mx-auto" style={{ width: 100, height: 100 }}>
                <Image
                  src={`/assets/add-child-avatar/${child.avatar}.png`}
                  alt={child.name}
                  roundedCircle
                  width={100}
                  height={100}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {/* Fallback */}
                {!child.avatar && (
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 start-0"
                    style={{ width: 100, height: 100, fontSize: 32 }}
                  >
                    {child.name.charAt(0)}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: 100, height: 100, fontSize: 32 }}
              >
                {child.name.charAt(0)}
              </div>
            )}
            <h5 className="mt-2">{child.name}</h5>
            <small className="text-muted">{child.age} yrs</small>
            <div className="mt-2">
              <Badge bg={child.progress > 75 ? "success" : "warning"}>
                {child.progress}%
              </Badge>
            </div>
          </Col>

          <Col md={8}>
            <h6>Subject Progress</h6>
            {child.subjects?.length > 0 ? (
              child.subjects.map((s) => (
                <div key={s.name} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <small>{s.name}</small>
                    <small>{s.score}%</small>
                  </div>
                  <ProgressBar now={s.score} />
                </div>
              ))
            ) : (
              <p className="text-muted">No subject data available.</p>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProgressModal;