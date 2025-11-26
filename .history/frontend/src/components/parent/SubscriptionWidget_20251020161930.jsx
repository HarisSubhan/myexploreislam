import React, { useState, useEffect } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { getsubscriptionsParentByidApi } from "../../services/subscribeApi";


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
        console.log("No parentId provided:", parentId);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching subscription data for parentId:", parentId);
        const data = await getsubscriptionsParentByidApi(parentId);
        console.log("Subscription API response:", data);
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

  // Debug: Log current state
  console.log("SubscriptionWidget state:", {
    parentLoading,
    loading,
    error,
    subscriptionData,
    parentId,
  });

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

  // Handle different API response structures
  const getSubscriptionInfo = () => {
    // Case 1: Direct properties (original structure)
    if (subscriptionData.plan && subscriptionData.daysUsed !== undefined) {
      return {
        plan: subscriptionData.plan,
        daysUsed: subscriptionData.daysUsed,
        totalDays: subscriptionData.totalDays || 30, // default to 30 if not provided
        renewalDate: subscriptionData.renewalDate || "N/A",
      };
    }

    // Case 2: Nested data property (common API pattern)
    if (subscriptionData.data) {
      const data = subscriptionData.data;
      return {
        plan: data.plan || data.name || "Unknown Plan",
        daysUsed: data.daysUsed || data.usedDays || data.days_used || 0,
        totalDays: data.totalDays || data.total_days || data.duration || 30,
        renewalDate:
          data.renewalDate || data.renewal_date || data.endDate || "N/A",
      };
    }

    // Case 3: Try to find common property names
    const plan =
      subscriptionData.plan_name ||
      subscriptionData.subscription_plan ||
      subscriptionData.type ||
      "Unknown";
    const daysUsed =
      subscriptionData.days_used ||
      subscriptionData.used_days ||
      subscriptionData.consumed_days ||
      0;
    const totalDays =
      subscriptionData.total_days ||
      subscriptionData.duration_days ||
      subscriptionData.validity ||
      30;
    const renewalDate =
      subscriptionData.renewal_date ||
      subscriptionData.end_date ||
      subscriptionData.expires_at ||
      "N/A";

    return { plan, daysUsed, totalDays, renewalDate };
  };

  const { plan, daysUsed, totalDays, renewalDate } = getSubscriptionInfo();
  const pct = totalDays > 0 ? Math.round((daysUsed / totalDays) * 100) : 0;

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
