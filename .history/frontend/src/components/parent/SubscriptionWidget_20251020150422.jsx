import React, { useState, useEffect } from "react";
import { Card, ProgressBar } from "react-bootstrap";


export default function SubscriptionWidget({
  parentId,
  loading: externalLoading,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        setError(null);

        let subscriptionData;

        if (parentId) {
          // Fetch specific parent's subscription
          subscriptionData = await getsubscriptionsParentByidApi(parentId);
        } else {
          // Fetch all active subscriptions and use the first one
          const allSubscriptions = await getsubscriptionsAllActiveApi();
          subscriptionData = allSubscriptions[0]; // Use first subscription or adjust logic as needed
        }

        setData(subscriptionData);
      } catch (err) {
        console.error("Error fetching subscription data:", err);
        setError("Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [parentId]);

  // Use external loading prop if provided, otherwise use internal loading state
  const isLoading = externalLoading !== undefined ? externalLoading : loading;

  if (isLoading) {
    return (
      <Card className="pd-card h-100">
        <Card.Body>
          <h5 className="section-title mb-3">Subscription </h5>
          <div className="skeleton" style={{ height: 120 }} />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="pd-card h-100">
        <Card.Body>
          <h5 className="section-title mb-3">Subscription</h5>
          <div className="text-danger small">{error}</div>
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
