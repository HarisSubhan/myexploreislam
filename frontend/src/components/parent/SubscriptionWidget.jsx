import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

export default function SubscriptionWidget({ data, loading }) {
  if (loading) {
    return (
      <Card className="pd-card h-100">
        <Card.Body>
          <h5 className="section-title mb-3">Subscription </h5>
          <div className="skeleton" style={{ height: 120 }} />
        </Card.Body>
      </Card>
    );
  }

  if (!data) return null;

  const { plan, daysUsed, totalDays, renewalDate } = data;
  const pct = Math.round((daysUsed / totalDays) * 100);

  return (
    <Card className="pd-card h-100">
      <Card.Body className="d-flex flex-column">
        <h5 className="section-title mb-2">Subscription</h5>
        <div className="mb-2 small text-muted">
          Plan: <strong>{plan}</strong>
        </div>
        <div className="mb-2 small">
          Usage: <strong>{daysUsed}</strong>/<strong>{totalDays}</strong> days
        </div>
        <ProgressBar now={pct} label={`${pct}%`} className="mb-2" />
        <div className="small text-muted mt-auto">
          Renewal: <strong>{renewalDate}</strong>
        </div>
      </Card.Body>
    </Card>
  );
}
