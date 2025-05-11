// src/components/auth/RequireAuth.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // Create this simple hook

export const RequireAuth = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/unauthorized" />; // Create this route
  }

  return children;
};
