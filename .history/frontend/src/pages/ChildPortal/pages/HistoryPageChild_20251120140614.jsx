import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { dashboardApi } from "../../../services/childActivity";


const HistoryPageChild = ({ childId }) => {
  const [moduleHistory, setModuleHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getChildActivity(childId);
        
        // Transform the API response to match your component structure
        const historyData = response.data.map(item => ({
          type: item.activityType || "Activity", // Adjust based on your API response
          title: item.title || item.moduleName || "Untitled",
          date: new Date(item.createdAt || item.date).toISOString().split('T')[0] // Format date
        }));
        
        setModuleHistory(historyData);
        setError(null);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load history. Please try again.");
        setModuleHistory([]); // Clear any previous data
      } finally {
        setLoading(false);
      }
    };

    if (childId) {
      fetchHistory();
    }
  }, [childId]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading history...</span>
        </Spinner>
        <div>Loading your history...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  // Empty state
  if (moduleHistory.length === 0) {
    return (
      <>
        <h3 className="mb-4">Your History</h3>
        <Card className="p-4 text-center">
          <div className="text-muted">No history found. Start exploring content to see your activity here!</div>
        </Card>
      </>
    );
  }

  return (
    <>
      <h3 className="mb-4">Your History</h3>
      {moduleHistory.map((item, index) => (
        <Card key={index} className="mb-3 p-3">
          <div><strong>{item.type}</strong>: {item.title}</div>
          <small className="text-muted">{item.date}</small>
        </Card>
      ))}
    </>
  );
};

export default HistoryPageChild;