import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { IoPeople, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

const CONFIG = [
  {
    key: "totalChildren",
    label: "Total Child Accounts",
    icon: <IoPeople />,
    accent: "linear-gradient(135deg,#6366f1,#60a5fa)"
  },
  {
    key: "active",
    label: "Active Accounts",
    icon: <IoCheckmarkCircle />,
    accent: "linear-gradient(135deg,#16a34a,#22c55e)"
  },
  {
    key: "inactive",
    label: "Inactive Accounts",
    icon: <IoCloseCircle />,
    accent: "linear-gradient(135deg,#dc2626,#f87171)"
  }
];

export default function StatCards({ stats, loading }) {
  return (
    <Row className="g-4 mb-2">
      {CONFIG.map(cfg => (
        <Col xs={12} sm={6} md={4} key={cfg.key}>
          <Card className="pd-card h-100" aria-live="polite">
            <div className="stat-card">
              <div className="stat-meta">
                <span className="stat-label">{cfg.label}</span>
                {loading ? (
                  <div
                    style={{ width: "70px", height: "32px" }}
                    className="skeleton"
                    aria-label="Loading stat"
                  />
                ) : (
                  <p className="stat-value mb-0">
                    {String(stats[cfg.key]).padStart(2, "0")}
                  </p>
                )}
              </div>
              <div
                className="stat-icon"
                style={{ background: cfg.accent }}
                aria-hidden="true"
              >
                {cfg.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
