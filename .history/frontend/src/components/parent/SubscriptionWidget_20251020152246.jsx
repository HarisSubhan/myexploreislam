import React from "react";
import { Card, ProgressBar, Button } from "react-bootstrap";

export default function SubscriptionWidget({ data, loading, parentId }) {
  if (loading) {
    return (
      <Card className="pd-card h-100">
        <Card.Body>
          <h5 className="section-title mb-3">Subscription</h5>
          <div className="skeleton" style={{ height: 120 }} />
        </Card.Body>
      </Card>
    );
  }

  // Handle no subscription data
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className="pd-card h-100">
        <Card.Body className="d-flex flex-column text-center">
          <h5 className="section-title mb-3">Subscription</h5>
          <div className="text-muted mb-3">No active subscription found</div>
          <Button variant="primary" size="sm">
            Subscribe Now
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const { plan, daysUsed, totalDays, renewalDate, status } = data;
  const pct = Math.round((daysUsed / totalDays) * 100);

  // Determine progress bar variant based on status
  const getProgressVariant = () => {
    if (status === "active") return "success";
    if (status === "expired") return "danger";
    if (status === "pending") return "warning";
    return "primary";
  };

  return (
    <Card className="pd-card h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="section-title mb-0">Subscription</h5>
          {status && (
            <span className={`badge bg-${getProgressVariant()}`}>{status}</span>
          )}
        </div>

        <div className="mb-2 small text-muted">
          Plan: <strong>{plan || "No plan"}</strong>
        </div>

        <div className="mb-2 small">
          Usage: <strong>{daysUsed || 0}</strong>/
          <strong>{totalDays || 0}</strong> days
        </div>

        <ProgressBar
          now={pct}
          label={`${pct}%`}
          variant={getProgressVariant()}
          className="mb-2"
        />

        {renewalDate && (
          <div className="small text-muted mt-auto">
            Renewal: <strong>{renewalDate}</strong>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
