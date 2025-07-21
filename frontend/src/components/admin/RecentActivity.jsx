// src/components/RecentActivity.js
import { Card, ListGroup } from "react-bootstrap";

const activities = [
  { user: "Ahmed", action: "completed a quiz", time: "2 mins ago" },
  { user: "Fatima", action: "joined the weekly plan", time: "10 mins ago" },
  { user: "Ali", action: "submitted an assignment", time: "30 mins ago" },
  { user: "Zainab", action: "watched a video", time: "1 hour ago" },
];

function RecentActivity() {
  return (
    <Card className="shadow-sm border-0" style={{ width: "27%", overflowY: "auto" }}>
      <Card.Body>
        <h5 className="mb-4">Recent Activity</h5>
        <ListGroup variant="flush">
          {activities.map((activity, index) => (
            <ListGroup.Item key={index}>
              <strong>{activity.user}</strong> {activity.action}
              <div className="text-muted small">{activity.time}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default RecentActivity;
