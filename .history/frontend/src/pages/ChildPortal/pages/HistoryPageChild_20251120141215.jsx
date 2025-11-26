import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert, Badge } from "react-bootstrap";
import { dashboardApi } from "../../../"; // Adjust the import path
import { useUser } from "./path-to-user-context"; // Adjust the import path

const HistoryPageChild = () => {
  const { user } = useUser();
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get child ID from user context
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
        
        // Transform the API response to match your expected format
        const transformedLogs = response.data.data.map(item => ({
          id: item.log_id,
          type: "Activity", // You can customize this based on action type
          title: item.action,
          date: new Date(item.created_at).toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
          timestamp: item.created_at,
          metadata: item.metadata ? JSON.parse(item.metadata) : null
        }));

        setActivityLogs(transformedLogs);
        setError(null);
      } catch (err) {
        console.error("Error fetching activity history:", err);
        setError("Failed to load activity history. Please try again.");
        setActivityLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityHistory();
  }, [childId]);

  // Format action type with appropriate badges
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

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading activity history...</span>
        </Spinner>
        <div className="mt-2">Loading your activity history...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (activityLogs.length === 0) {
    return (
      <>
        <h3 className="mb-4">Your Activity History</h3>
        <Card className="p-4 text-center">
          <div className="text-muted">
            No activity history found. Your activities will appear here as you use the app!
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <h3 className="mb-4">Your Activity History</h3>
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
                
                {/* You can add more details here based on metadata */}
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <div className="mt-2 small">
                    <strong>Details:</strong> 
                    <pre className="d-inline ms-1 small">
                      {JSON.stringify(item.metadata, null, 2)}
                    </pre>
                  </div>
                )}
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