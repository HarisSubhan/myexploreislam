import React from "react";
import { Card, Spinner } from "react-bootstrap";

const ActivityTimeline = ({ data, loading }) => {
  const getActivityIcon = (action) => {
    const icons = {
      "Logged In": "🔓",
      "Logged Out": "🔒",
      "Completed Quiz": "📝",
      "Watched Video": "🎬",
      "Started Lesson": "📚",
      "Completed Lesson": "✅",
      "Played Game": "🎮",
      "Read Story": "📖",
      "Earned Badge": "🏆",
      "Level Up": "⭐",
      default: "🔔",
    };

    // Match action with icons
    for (const [key, icon] of Object.entries(icons)) {
      if (action.includes(key) || key.includes(action)) {
        return icon;
      }
    }

    return icons.default;
  };

  const getActivityDescription = (action) => {
    const descriptions = {
      "Logged In": "logged in to their account",
      "Logged Out": "logged out from their account",
      "Completed Quiz": "completed a quiz",
      "Watched Video": "watched an educational video",
      "Started Lesson": "started a new lesson",
      "Completed Lesson": "completed a lesson",
      "Played Game": "played an educational game",
      "Read Story": "read an Islamic story",
      "Earned Badge": "earned a new badge",
      "Level Up": "leveled up in their learning journey",
    };

    // Match action with descriptions
    for (const [key, description] of Object.entries(descriptions)) {
      if (action.includes(key) || key.includes(action)) {
        return description;
      }
    }

    return `performed: ${action}`;
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Recently";
    }
  };

  // Parse metadata if it's a JSON string
  const parseMetadata = (metadata) => {
    if (!metadata || metadata === "{}") return null;

    try {
      return JSON.parse(metadata);
    } catch (error) {
      console.warn("Failed to parse metadata:", metadata);
      return null;
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
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold">Recent Activity</h6>
          {data.length > 0 && (
            <span className="badge bg-primary rounded-pill">
              {data.length} activities
            </span>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-3">
        <div className="timeline">
          {data.map((activity, index) => {
            const metadata = parseMetadata(activity.metadata);
            const activityDescription = getActivityDescription(activity.action);

            return (
              <div
                key={activity.log_id || index}
                className="timeline-item d-flex mb-3"
              >
                <div className="timeline-icon me-3">
                  <span className="fs-5">
                    {getActivityIcon(activity.action)}
                  </span>
                </div>
                <div className="timeline-content flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1 small fw-semibold text-primary">
                        {activity.child_name || "Child"}
                      </h6>
                      <p className="mb-1 small text-dark">
                        <span className="text-capitalize">
                          {activityDescription}
                        </span>
                        {metadata && metadata.score && (
                          <span className="text-success fw-medium">
                            {" "}
                            with score: {metadata.score}%
                          </span>
                        )}
                        {metadata && metadata.lesson && (
                          <span className="text-info">
                            {" "}
                            - {metadata.lesson}
                          </span>
                        )}
                        {metadata && metadata.badge && (
                          <span className="text-warning">
                            {" "}
                            - {metadata.badge}
                          </span>
                        )}
                      </p>

                      {/* Show additional metadata details */}
                      {metadata && (
                        <div className="mt-1">
                          {metadata.duration && (
                            <small className="text-muted me-2">
                              ⏱️ {metadata.duration} mins
                            </small>
                          )}
                          {metadata.category && (
                            <small className="text-muted me-2">
                              📁 {metadata.category}
                            </small>
                          )}
                          {metadata.points && (
                            <small className="text-success me-2">
                              ✨ +{metadata.points} points
                            </small>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-muted small text-nowrap ms-2">
                      {formatTime(activity.created_at)}
                    </span>
                  </div>

                  {/* Show action type badge */}
                  <div className="mt-1">
                    <small
                      className={`badge ${
                        activity.action.includes("Logged In")
                          ? "bg-success"
                          : activity.action.includes("Logged Out")
                            ? "bg-secondary"
                            : activity.action.includes("Completed")
                              ? "bg-success"
                              : activity.action.includes("Started")
                                ? "bg-info"
                                : activity.action.includes("Watched")
                                  ? "bg-primary"
                                  : activity.action.includes("Played")
                                    ? "bg-warning"
                                    : activity.action.includes("Earned")
                                      ? "bg-warning text-dark"
                                      : "bg-light text-dark"
                      } rounded-pill`}
                    >
                      {activity.action}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show total logs count if available in props */}
        {data.length >= 10 && (
          <div className="text-center mt-3 pt-2 border-top">
            <small className="text-muted">
              Showing latest {data.length} activities
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ActivityTimeline;
