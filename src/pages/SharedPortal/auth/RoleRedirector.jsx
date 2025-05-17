import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const RoleRedirector = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
  
    const redirectPath = location.state?.from || getDefaultRoute(user.role);
    navigate(redirectPath);
  }, [user, navigate, location]);

  const getDefaultRoute = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "parent":
        return "/parent/overview";
      case "child":
        return "/child/learn";
      default:
        return "/";
    }
  };

  return null; 
};

export default RoleRedirector;