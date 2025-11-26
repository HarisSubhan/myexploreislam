import React, { useState, useEffect } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { getsubscriptionsParentByidApi } from "../services/api";

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

  // Show loading state
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

  if (!subscriptionData || !subscriptionData.data) {
    return (
      <Card className="pd-card h-100">
        <Card.Body className="d-flex flex-column">
          <h5 className="section-title mb-2">Subscription</h5>
          <div className="small text-muted">No subscription data available</div>
        </Card.Body>
      </Card>
    );
  }

  // Extract data from the API response structure
  const { data } = subscriptionData;

  // Calculate days used and total days
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const today = new Date();

  // Total days in subscription
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Days used so far
  const daysUsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));

  // Ensure daysUsed doesn't exceed totalDays
  const actualDaysUsed = Math.min(Math.max(0, daysUsed), totalDays);

  // Format dates for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pct =
    totalDays > 0 ? Math.round((actualDaysUsed / totalDays) * 100) : 0;

  return (
    <Card className="pd-card h-100">
      <Card.Body className="d-flex flex-column">
        <h5 className="section-title mb-2">Subscription</h5>
        <div className="mb-2 small text-muted">
          Plan: <strong>{data.plan_name}</strong>
        </div>
        <div className="mb-2 small">
          Max Children: <strong>{data.max_children}</strong>
        </div>
        <div className="mb-2 small">
          Usage: <strong>{actualDaysUsed}</strong>/<strong>{totalDays}</strong>{" "}
          days
        </div>
        <ProgressBar
          now={pct}
          label={`${pct}%`}
          className="mb-2"
          variant={pct > 80 ? "warning" : pct > 95 ? "danger" : "primary"}
        />
        <div className="small text-muted">
          Start: <strong>{formatDate(startDate)}</strong>
        </div>
        <div className="small text-muted mt-auto">
          Renewal: <strong>{formatDate(endDate)}</strong>
        </div>
        <div className="small text-muted">
          Status:{" "}
          <strong className={data.is_active ? "text-success" : "text-danger"}>
            {data.is_active ? "Active" : "Inactive"}
          </strong>
        </div>
      </Card.Body>
    </Card>
  );
}
