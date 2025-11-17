import React, { useState, useEffect } from "react";
import { getChildRequests } from "../../services/parentApi";


const ParentRequestChild = () => {
  const [childRequests, setChildRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch child requests on component mount
  useEffect(() => {
    fetchChildRequests();
  }, []);

  const fetchChildRequests = async () => {
    try {
      setLoading(true);
      const requests = await getChildRequests();
      setChildRequests(requests);
      setError(null);
    } catch (err) {
      setError("Failed to fetch child requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateChildRequestStatus(id, newStatus);
      // Update local state
      setChildRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      setError("Failed to update status");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteChildRequest(id);
        // Remove from local state
        setChildRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );
      } catch (err) {
        setError("Failed to delete request");
        console.error(err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading child requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button
          onClick={fetchChildRequests}
          className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Child Requests Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all child registration requests from parents
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Children Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {childRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No child requests found
                  </td>
                </tr>
              ) : (
                childRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.parent_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {request.requested_children}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "approved")
                              }
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {childRequests.length} request(s)
            </span>
            <button
              onClick={fetchChildRequests}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentRequestChild;
