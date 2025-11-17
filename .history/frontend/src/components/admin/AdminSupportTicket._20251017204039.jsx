import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Modal,
  Dropdown,
  Alert,
  Spinner,
} from "react-bootstrap";
import AdminLayout from "../../pages/AdminPortal/AdminApp";
import ticketApi from "../../services/ticketApi";
import { useUser } from "../../context/UserContext"; // Adjust path as needed

const AdminSupportTicket = () => {
  const { user } = useUser(); // Get current user from context
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ticketApi.getAll();
      console.log("API Response:", response);

      // Transform API data to match your frontend structure
      const transformedTickets = response.tickets?.map((ticket) => {
        const userInfo = ticket.parent_id || ticket.user || {};

        return {
          id: ticket.id || ticket._id,
          ticketNumber: ticket.ticket_number || `TKT-${ticket.id?.toString().slice(-6)}`,
          subject: ticket.subject || "No Subject",
          description: ticket.description || "No description provided",
          user: {
            name: userInfo.name || userInfo.username || "Unknown User",
            email: userInfo.email || "No email",
            type: "parent",
          },
          status: ticket.status?.toLowerCase() || "open",
          category: ticket.category || "general",
          createdAt: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : new Date().toLocaleString(),
          updatedAt: ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : new Date().toLocaleString(),
          lastReply: calculateLastReply(ticket.updatedAt || ticket.createdAt),
          messages: ticket.messages?.map((msg) => ({
            id: msg._id || msg.id,
            sender: msg.sender === "agent" ? "Support Agent" : userInfo.name || "User",
            message: msg.message || msg.content,
            timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleString() : new Date().toLocaleString(),
            type: msg.sender === "agent" ? "agent" : "user",
          })) || [
            {
              id: 1,
              sender: userInfo.name || "User",
              message: ticket.description || "No message",
              timestamp: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : new Date().toLocaleString(),
              type: "user",
            },
          ],
        };
      }) || [];

      setTickets(transformedTickets);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate last reply time
  const calculateLastReply = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      const now = new Date();
      const updated = new Date(dateString);
      const diffMs = now - updated;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    } catch (e) {
      return "Unknown";
    }
  };

  // Load tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter tickets based on search and filters
  useEffect(() => {
    let result = tickets;

    if (searchTerm) {
      result = result.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    setFilteredTickets(result);
  }, [searchTerm, statusFilter, tickets]);

  const getStatusVariant = (status) => {
    const variants = {
      open: "primary",
      "in-progress": "info",
      pending: "warning",
      resolved: "success",
      closed: "secondary",
    };
    return variants[status] || "secondary";
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setActionLoading(true);

      // Use the actual API call with the admin user info
      const newMessage = {
        sender: "agent", // Admin is always agent
        message: replyMessage,
        timestamp: new Date().toISOString(),
      };

      // API call to update ticket with new message
      await ticketApi.update(selectedTicket.id, {
        messages: [...selectedTicket.messages, newMessage],
        status: "in-progress"
      });

      // Update local state
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              messages: [...ticket.messages, { ...newMessage, id: selectedTicket.messages.length + 1, type: "agent" }],
              status: "in-progress",
              updatedAt: new Date().toISOString(),
              lastReply: "Just now",
            }
          : ticket
      );

      setTickets(updatedTickets);
      setReplyMessage("");
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, { ...newMessage, id: selectedTicket.messages.length + 1, type: "agent" }],
        status: "in-progress",
        updatedAt: new Date().toISOString(),
        lastReply: "Just now",
      });

    } catch (err) {
      setError("Failed to send reply: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      // API call to update ticket status
      await ticketApi.update(ticketId, { status: newStatus });

      // Update local state
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : ticket
      );

      setTickets(updatedTickets);

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }

    } catch (err) {
      setError("Failed to update ticket status: " + err.message);
      // Revert on error
      fetchTickets();
    }
  };

  // ... rest of your component remains the same
  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading tickets...</span>
          </Spinner>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-support-ticket">
        {/* Your existing JSX remains exactly the same */}
        {/* ... */}
      </div>
    </AdminLayout>
  );
};

export default AdminSupportTicket;