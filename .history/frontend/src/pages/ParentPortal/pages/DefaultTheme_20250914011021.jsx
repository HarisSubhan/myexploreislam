.account-container {
  min-height: 80vh;
}

/* Cards */
.account-card {
  border: none;
  border-radius: 18px;
  padding: 30px 20px;
  background: var(--bs-light);
  transition: all 0.3s ease;
  cursor: pointer;
}
.account-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

/* Icon Circle */
.icon-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0d6efd, #20c997);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

/* Back button */
.back-btn {
  font-weight: 500;
  text-decoration: none !important;
  color: var(--bs-primary);
  transition: all 0.2s ease;
}
.back-btn:hover {
  color: #0a58ca;
  transform: translateX(-4px);
}

/* Form styling */
.account-form {
  border-radius: 18px;
}
