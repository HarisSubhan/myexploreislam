.admin-support-ticket {
  padding: 1rem;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stats-scroll-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  min-width: 300px;
}

.stat-item {
  text-align: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Ticket Cards for Mobile */
.ticket-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
}

.ticket-meta {
  font-size: 0.875rem;
}

/* Mobile Messages */
.messages-container-mobile {
  max-height: 40vh;
  overflow-y: auto;
}

.message-mobile {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.user-message {
  background: #f8f9fa;
  border-left: 4px solid #007bff;
}

.agent-message {
  background: #e3f2fd;
  border-left: 4px solid #28a745;
}

.message-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.message-content-mobile {
  white-space: pre-wrap;
  line-height: 1.4;
}

/* Ticket Info for Mobile */
.ticket-info-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f1f1;
}

.info-row .label {
  font-weight: 600;
  color: #495057;
}

/* Floating Action Button */
.floating-action-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* Active Filters */
.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

/* Responsive Table */
.table-responsive {
  font-size: 0.875rem;
}

/* Modal Optimizations */
.ticket-modal .modal-dialog {
  margin: 0.5rem;
  max-width: none;
}

.ticket-modal .modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.ticket-modal .modal-header,
.ticket-modal .modal-footer {
  border: none;
  padding: 1rem;
}

.ticket-modal .modal-body {
  padding: 1rem;
}

/* Offcanvas Optimizations */
.offcanvas-header {
  border-bottom: 1px solid #dee2e6;
}

.offcanvas-body {
  padding: 1rem;
}

/* Touch-friendly buttons */
.btn {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
}

/* Form controls */
.form-control, .form-select {
  border-radius: 8px;
  font-size: 0.875rem;
}

/* Badge sizes */
.badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

/* Scrollbar styling for mobile */
.stats-scroll-container::-webkit-scrollbar,
.messages-container-mobile::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.stats-scroll-container::-webkit-scrollbar-track,
.messages-container-mobile::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.stats-scroll-container::-webkit-scrollbar-thumb,
.messages-container-mobile::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

/* Media Queries for different screen sizes */
@media (max-width: 576px) {
  .admin-support-ticket {
    padding: 0.5rem;
  }
  
  .header-section {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .floating-action-btn {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
}

@media (min-width: 768px) {
  .admin-support-ticket {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  
  .tickets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 992px) {
  .admin-support-ticket {
    padding: 2rem;
  }
}

/* Safe area insets for modern mobile devices */
@supports(padding: max(0px)) {
  .admin-support-ticket {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
  
  .floating-action-btn {
    right: max(2rem, env(safe-area-inset-right));
    bottom: max(2rem, env(safe-area-inset-bottom));
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .ticket-card {
    transition: none;
  }
}