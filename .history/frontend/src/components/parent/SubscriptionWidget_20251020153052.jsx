import React, { useState, useEffect } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { getsubscriptionsParentByidApi } from "../"; // Adjust import path as needed

export default function SubscriptionWidget({
  parentId,
  loading: parentLoading,
}) {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!parentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getsubscriptionsParentByidApi(parentId);
        setSubscriptionData(data);
      } catch (err) {
        console.error("Error fetching subscription data:", err);
        setError("Failed to load subscription data");
        setSubscriptionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [parentId]);

  // Show loading state if either parent is loading or subscription is loading
  if (parentLoading || loading) {
    return (
      <Card className="pd-card h-100">
        <Card.Body>
          <h5 className="section-title mb-3">Subscription</h5>
          <div className="skeleton" style={{ height: 120 }} />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="pd-card h-100">
        <Card.Body className="d-flex flex-column">
          <h5 className="section-title mb-2">Subscription</h5>
          <div className="text-danger small">{error}</div>
        </Card.Body>
      </Card>
    );
  }

  if (!subscriptionData) {
    return (
      <Card className="pd-card h-100">
        <Card.Body className="d-flex flex-column">
          <h5 className="section-title mb-2">Subscription</h5>
          <div className="small text-muted">No subscription data available</div>
        </Card.Body>
      </Card>
    );
  }

  const { plan, daysUsed, totalDays, renewalDate } = subscriptionData;
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
