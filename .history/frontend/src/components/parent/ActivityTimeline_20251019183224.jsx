import React from "react";
import { Card, Spinner } from "react-bootstrap";

const ActivityTimeline = ({ data, loading }) => {
  const getActivityIcon = (activityType) => {
    const icons = {
      quiz: "📝",
      video: "🎬",
      lesson: "📚",
      game: "🎮",
      reading: "📖",
      default: "🔔",
    };
    return icons[activityType] || icons.default;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Recently";

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Recently";
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="text-center p-4">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 small text-muted">
            Loading recent activity...
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <Card.Header className="bg-white border-0 py-3">
          <h6 className="mb-0 fw-semibold">Recent Activity</h6>
        </Card.Header>
        <Card.Body className="text-center p-5">
          <div className="text-muted">
            <p className="mb-1">No recent activity</p>
            <small>
              Activity will appear here as children use the platform
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white border-0 py-3">
        <h6 className="mb-0 fw-semibold">Recent Activity</h6>
      </Card.Header>
      <Card.Body className="p-3">
        <div className="timeline">
          {data.slice(0, 10).map((activity, index) => (
            <div
              key={activity.id || index}
              className="timeline-item d-flex mb-3"
            >
              <div className="timeline-icon me-3">
                <span className="fs-5">
                  {getActivityIcon(activity.activity_type)}
                </span>
              </div>
              <div className="timeline-content flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1 small fw-semibold">
                      {activity.child_name || "Child"}
                    </h6>
                    <p className="mb-1 small text-muted">
                      {activity.description ||
                        activity.activity_type ||
                        "Completed an activity"}
                    </p>
                  </div>
                  <span className="text-muted small">
                    {formatTime(activity.timestamp || activity.created_at)}
                  </span>
                </div>
                {activity.details && (
                  <p className="mb-0 small text-muted">{activity.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {data.length > 10 && (
          <div className="text-center mt-3">
            <small className="text-muted">
              Showing 10 of {data.length} activities
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ActivityTimeline;
