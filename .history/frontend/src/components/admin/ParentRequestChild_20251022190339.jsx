import React, { useState, useEffect } from "react";
import { getChildRequests, updateChildRequestStatusApi } from "../../services/parentApi";


const ParentRequestChild = () => {
  const [childRequests, setChildRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChildRequests();
  }, []);

  const fetchChildRequests = async () => {
    try {
      setLoading(true);
      const requests = await getChildRequests();
      setChildRequests(requests);
    } catch (err) {
      setError("Failed to fetch child requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateChildRequestStatusApi(id, newStatus);
      setChildRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Child Requests Management</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              ID
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Parent Name
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Email
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Children
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Created At
            </th>
            <th
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                textAlign: "left",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {childRequests.map((request) => (
            <tr key={request.id}>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {request.id}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {request.parent_name}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {request.email}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {request.requested_children}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {request.status}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {new Date(request.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request.id, "approved")}
                      style={{
                        marginRight: "5px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, "rejected")}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParentRequestChild;
