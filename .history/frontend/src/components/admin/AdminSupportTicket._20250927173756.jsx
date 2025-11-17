import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Badge, Button, Form, InputGroup, Row, Col, 
  Modal, Dropdown, Accordion, ListGroup, Offcanvas 
} from 'react-bootstrap';
import AdminLayout from '../../pages/AdminPortal/AdminApp';
import './AdminSupportTicket.css';

const AdminSupportTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'

  // Mock data (same as before)
  useEffect(() => {
    const mockTickets = [
      {
        id: 1,
        ticketNumber: 'TKT-2024-001',
        subject: 'Video playback issue',
        description: 'Videos are buffering constantly and not playing smoothly',
        user: { name: 'Sarah Johnson', email: 'sarah@example.com', type: 'parent' },
        priority: 'high',
        status: 'open',
        category: 'technical',
        assignedTo: 'Support Agent 1',
        createdAt: '2024-01-15 14:30',
        updatedAt: '2024-01-15 16:45',
        lastReply: '2 hours ago',
        messages: [
          {
            id: 1,
            sender: 'Sarah Johnson',
            message: 'Hello, I\'m having trouble with video playback. The videos keep buffering every few seconds.',
            timestamp: '2024-01-15 14:30',
            type: 'user'
          },
          {
            id: 2,
            sender: 'Support Agent 1',
            message: 'We\'re looking into this issue. Can you tell us what device and browser you\'re using?',
            timestamp: '2024-01-15 15:15',
            type: 'agent'
          }
        ]
      },
      // ... other tickets (same as before)
    ];

    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
  }, []);

  // Filter tickets (same logic as before)
  useEffect(() => {
    let result = tickets;
    if (searchTerm) {
      result = result.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') result = result.filter(ticket => ticket.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(ticket => ticket.priority === priorityFilter);
    setFilteredTickets(result);
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  const getPriorityVariant = (priority) => {
    const variants = { 'low': 'success', 'medium': 'warning', 'high': 'danger' };
    return variants[priority] || 'secondary';
  };

  const getStatusVariant = (status) => {
    const variants = { 
      'open': 'primary', 'in-progress': 'info', 'pending': 'warning', 
      'resolved': 'success', 'closed': 'secondary' 
    };
    return variants[status] || 'secondary';
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleReply = () => {
    if (!replyMessage.trim()) return;
    // ... same reply logic as before
  };

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  // Mobile-friendly ticket card component
  const TicketCard = ({ ticket }) => (
    <Card className="ticket-card mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Badge bg={getPriorityVariant(ticket.priority)} className="me-2">
              {ticket.priority.toUpperCase()}
            </Badge>
            <Badge bg={getStatusVariant(ticket.status)}>
              {ticket.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <small className="text-muted">{ticket.lastReply}</small>
        </div>
        
        <Card.Title className="h6 mb-2">{ticket.subject}</Card.Title>
        <Card.Text className="text-muted small mb-2">{ticket.description}</Card.Text>
        
        <div className="ticket-meta mb-3">
          <div className="d-flex justify-content-between small text-muted">
            <span>#{ticket.ticketNumber}</span>
            <span>{ticket.user.name}</span>
          </div>
          <div className="d-flex justify-content-between small text-muted">
            <span>{ticket.assignedTo}</span>
            <span>{ticket.updatedAt.split(' ')[0]}</span>
          </div>
        </div>
        
        <div className="d-grid gap-2">
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => handleViewTicket(ticket)}
          >
            View & Reply
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="admin-support-ticket">
        {/* Header Section - Mobile Optimized */}
        <div className="header-section mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="h4 mb-1">🎫 Support Tickets</h2>
              <p className="text-muted small mb-0">Manage customer support requests</p>
            </div>
            <Button variant="primary" size="sm" className="d-none d-md-block">
              + New Ticket
            </Button>
          </div>

          {/* Mobile Stats - Horizontal Scroll */}
          <div className="stats-scroll-container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value text-primary">{ticketStats.total}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-warning">{ticketStats.open}</div>
                <div className="stat-label">Open</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-info">{ticketStats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-success">{ticketStats.resolved}</div>
                <div className="stat-label">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Mobile Optimized */}
        <Card className="mb-3">
          <Card.Body className="p-3">
            {/* Search Bar */}
            <div className="mb-3">
              <InputGroup size="sm">
                <Form.Control
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </div>

            {/* Quick Filters and View Toggle */}
            <div className="d-flex justify-content-between align-items-center">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setShowFilters(true)}
                className="d-md-none"
              >
                <i className="bi bi-funnel"></i> Filters
              </Button>
              
              <div className="d-none d-md-flex gap-2 flex-wrap">
                <Form.Select 
                  size="sm" 
                  style={{width: '120px'}}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </Form.Select>
                
                <Form.Select 
                  size="sm" 
                  style={{width: '120px'}}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Form.Select>
              </div>

              {/* View Toggle */}
              <div className="btn-group btn-group-sm" role="group">
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('list')}
                  className="d-none d-md-block"
                >
                  <i className="bi bi-list"></i>
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('card')}
                >
                  <i className="bi bi-grid"></i>
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(statusFilter !== 'all' || priorityFilter !== 'all' || searchTerm) && (
              <div className="active-filters mt-2">
                <small className="text-muted">Active filters: </small>
                {statusFilter !== 'all' && (
                  <Badge bg="light" text="dark" className="me-1">
                    Status: {statusFilter} ×
                  </Badge>
                )}
                {priorityFilter !== 'all' && (
                  <Badge bg="light" text="dark" className="me-1">
                    Priority: {priorityFilter} ×
                  </Badge>
                )}
                {searchTerm && (
                  <Badge bg="light" text="dark" className="me-1">
                    Search: {searchTerm} ×
                  </Badge>
                )}
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 ms-1"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Tickets List/Cards - Mobile Optimized */}
        <div className="tickets-container">
          {/* Desktop Table View */}
          {viewMode === 'list' ? (
            <div className="d-none d-md-block">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Tickets ({filteredTickets.length})</span>
                  <Button variant="outline-primary" size="sm">
                    Export CSV
                  </Button>
                </Card.Header>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Ticket #</th>
                        <th>Subject</th>
                        <th>User</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Last Update</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map(ticket => (
                        <tr key={ticket.id}>
                          <td><strong>{ticket.ticketNumber}</strong></td>
                          <td>
                            <div className="fw-bold">{ticket.subject}</div>
                            <small className="text-muted">{ticket.description}</small>
                          </td>
                          <td>
                            <div>{ticket.user.name}</div>
                            <small className="text-muted">{ticket.user.email}</small>
                          </td>
                          <td>
                            <Badge bg={getPriorityVariant(ticket.priority)}>
                              {ticket.priority.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(ticket.status)}>
                              {ticket.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <div>{ticket.updatedAt.split(' ')[0]}</div>
                            <small className="text-muted">{ticket.lastReply}</small>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </div>
          ) : null}

          {/* Mobile Card View */}
          <div className={viewMode === 'list' ? 'd-md-none' : ''}>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-5">
                <div className="fs-1 text-muted">📭</div>
                <p className="text-muted">No tickets found</p>
                <Button 
                  variant="outline-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="tickets-grid">
                {filteredTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <Button 
          variant="primary" 
          className="floating-action-btn d-md-none"
          onClick={() => {/* Add new ticket logic */}}
        >
          <i className="bi bi-plus-lg"></i>
        </Button>

        {/* Mobile Filters Offcanvas */}
        <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Form.Select>
            </Form.Group>
            
            <Button 
              variant="outline-secondary" 
              className="w-100"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Ticket Detail Modal - Mobile Optimized */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg"
          className="ticket-modal"
          scrollable
        >
          <Modal.Header closeButton className="sticky-top bg-white">
            <Modal.Title className="h6">
              {selectedTicket?.ticketNumber} - {selectedTicket?.subject}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTicket && (
              <div>
                {/* Ticket Info - Mobile Stacked */}
                <div className="ticket-info-mobile mb-4">
                  <div className="info-row">
                    <span className="label">User:</span>
                    <span>{selectedTicket.user.name} ({selectedTicket.user.email})</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Priority:</span>
                    <Badge bg={getPriorityVariant(selectedTicket.priority)}>
                      {selectedTicket.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <Badge bg={getStatusVariant(selectedTicket.status)}>
                      {selectedTicket.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="info-row">
                    <span className="label">Assigned:</span>
                    <span>{selectedTicket.assignedTo}</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="messages-container-mobile">
                  {selectedTicket.messages.map(message => (
                    <div
                      key={message.id}
                      className={`message-mobile ${message.type === 'agent' ? 'agent-message' : 'user-message'}`}
                    >
                      <div className="message-header-mobile">
                        <strong>{message.sender}</strong>
                        <small className="text-muted">{message.timestamp}</small>
                      </div>
                      <div className="message-content-mobile">{message.message}</div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="reply-section-mobile mt-4">
                  <Form.Group>
                    <Form.Label>Reply</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Type your response..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="sticky-bottom bg-white">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleReply}>
              Send Reply
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminSupportTicket;