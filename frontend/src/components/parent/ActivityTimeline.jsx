import React from "react";
import { Card } from "react-bootstrap";
import {
  IoPlayCircle,
  IoLogIn,
  IoLogOut
} from "react-icons/io5";

const ICON_MAP = {
  watch: <IoPlayCircle />,
  login: <IoLogIn />,
  logout: <IoLogOut />
};

export default function ActivityTimeline({ data, loading }) {
  return (
    <Card className="pd-card h-100">
      <Card.Body>
        <h5 className="section-title">Recent Activity</h5>
        {loading ? (
          <div className="skeleton" style={{ height: 200 }} />
        ) : (
          <ul className="list-unstyled mb-0">
            {data.slice(0, 6).map((item, i) => (
              <li key={i} className="d-flex align-items-start mb-3">
                <div className="me-3 text-primary fs-4" style={{ lineHeight: 1 }}>
                  {ICON_MAP[item.type] || ICON_MAP.watch}
                </div>
                <div>
                  <div className="fw-semibold">{item.text}</div>
                  <small className="text-muted">{item.time}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}
