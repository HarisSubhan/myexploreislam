/* ColorChanging.css */
.color-changing-container {
  max-width: 1200px;
}

.theme-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.theme-card-header {
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  border-bottom: none;
}

.theme-option {
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-align: center;
}

.theme-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.theme-option.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.2);
}

.theme-preview {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.theme-name {
  font-weight: 600;
  display: block;
}

.reset-button {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-width: 2px;
}

.theme-card-footer {
  background-color: #f8f9fa;
  border-top: none;
}

/* Background classes for better hover effects */
.bg-sunshine { background-color: rgba(255, 209, 102, 0.1); }
.bg-raspberry { background-color: rgba(241, 6, 102, 0.1); }
.bg-mint { background-color: rgba(6, 214, 160, 0.1); }
.bg-azure { background-color: rgba(58, 134, 255, 0.1); }
.bg-pumpkin { background-color: rgba(251, 86, 7, 0.1); }

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-option {
    padding: 0.75rem;
  }
  
  .theme-preview {
    height: 60px;
  }
}

@media (max-width: 576px) {
  .theme-option {
    padding: 0.5rem;
  }
  
  .theme-preview {
    height: 50px;
  }
}