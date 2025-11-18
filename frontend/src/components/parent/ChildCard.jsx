// components/ChildCard.js
import React from "react";
import { Col, Card, Button, ProgressBar, Badge, Image } from "react-bootstrap";
import { FaTrash, FaChartLine, FaEdit } from "react-icons/fa";

const ChildCard = ({ child, onEdit, onDelete, onViewProgress, deletingId }) => {
  return (
    <Col xs={12} md={6} lg={4} className="mb-4">
      <Card
        className="h-100 shadow-sm border-0 rounded-3"
        style={{ transition: "transform .15s", cursor: "default" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-6px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        <Card.Body className="d-flex flex-column">
          <div className="d-flex align-items-center mb-3">
            <div style={{ width: 56, height: 56 }}>
              {child.avatar ? (
                <div className="position-relative">
                  <Image
                    src={`/assets/add-child-avatar/${child.avatar}.png`}
                    alt={child.name}
                    roundedCircle
                    width={56}
                    height={56}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Fallback if image doesn't load */}
                  {!child.avatar && (
                    <div
                      className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle position-absolute top-0 start-0"
                      style={{ width: 56, height: 56, fontWeight: 700 }}
                    >
                      {child.name.charAt(0)}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 56, height: 56, fontWeight: 700 }}
                >
                  {child.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="ms-3 flex-grow-1">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0">{child.name}</h5>
                <Badge
                  bg={
                    child.progress > 75
                      ? "success"
                      : child.progress > 50
                      ? "warning"
                      : "secondary"
                  }
                >
                  {child.progress}%
                </Badge>
              </div>
              <small className="text-muted">{child.age} yrs</small>
            </div>
          </div>

          {/* Small stats row */}
          <div className="d-flex gap-2 mb-3">
            <Badge bg="info" className="text-dark">
              Quizzes: {child.subjects?.length ?? 0}
            </Badge>
            <Badge bg="light" className="text-dark">
              Videos: {child.certificates?.length ?? 0}
            </Badge>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted">Overall Progress</small>
              <small className="text-muted">{child.progress}%</small>
            </div>
            <ProgressBar
              now={child.progress}
              variant={child.progress > 75 ? "success" : "warning"}
              animated
            />
          </div>

          <div className="mt-auto d-flex justify-content-between">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => onViewProgress(child)}
            >
              <FaChartLine className="me-1" /> Progress
            </Button>
            <Button
              size="sm"
              variant="outline-warning"
              onClick={() => onEdit(child)}
            >
              <FaEdit className="me-1" /> Edit
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => onDelete(child.id)}
              disabled={deletingId === child.id}
            >
              {deletingId === child.id ? (
                "Deleting..."
              ) : (
                <>
                  <FaTrash className="me-1" /> Remove
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ChildCard;