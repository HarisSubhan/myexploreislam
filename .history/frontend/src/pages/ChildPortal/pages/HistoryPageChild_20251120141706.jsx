import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert, Badge } from "react-bootstrap";
import { dashboardApi } from "../../../services/childActivity"; 
import { useUser } from "../../../context/UserContext"; 

const HistoryPageChild = () => {
  const { user } = useUser();
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const childId = user?.id || user?.childId;

  useEffect(() => {
    const fetchActivityHistory = async () => {
      if (!childId) {
        setError("No child ID found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await dashboardApi.getChildActivity(childId);
        
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const transformedLogs = response.data.data
          .map(item => ({
            id: item.log_id,
            type: "Activity",
            title: item.action,
            date: new Date(item.created_at).toLocaleDateString('en-CA'),
            timestamp: item.created_at,
          }))
          .filter(item => new Date(item.timestamp) >= threeDaysAgo)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setActivityLogs(transformedLogs);
        setError(null);
      } catch (err) {
        setError("Failed to load activity history. Please try again.");
        setActivityLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityHistory();
  }, [childId]);

  const getActionVariant = (action) => {
    switch (action) {
      case "Logged In":
        return "success";
      case "Logged Out":
        return "secondary";
      case "Module Completed":
        return "primary";
      case "Video Watched":
        return "info";
      case "Quiz Attempted":
        return "warning";
      default:
        return "light";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" variant="primary" />
        <div className="mt-2">Loading your activity history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        {error}
      </Alert>
    );
  }

  if (activityLogs.length === 0) {
    return (
      <>
        <h3 className="mb-4">Your Activity History (Last 3 Days)</h3>
        <Card className="p-4 text-center">
          <div className="text-muted">
            No activity found in the last 3 days.
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <h3 className="mb-4">Your Activity History (Last 3 Days)</h3>
      <div className="mb-3 text-muted">
        Showing {activityLogs.length} activity log{activityLogs.length !== 1 ? 's' : ''}
      </div>
      
      {activityLogs.map((item) => (
        <Card key={item.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <Badge 
                    bg={getActionVariant(item.title)} 
                    className="me-2"
                  >
                    {item.type}
                  </Badge>
                  <strong>{item.title}</strong>
                </div>
              </div>
              
              <div className="text-end">
                <small className="text-muted d-block">{item.date}</small>
                <small className="text-muted">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default HistoryPageChild;