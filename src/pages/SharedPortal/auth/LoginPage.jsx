import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import AuthLayout from "@/pages/SharedPortal/auth/AuthLayout.jsx";
import AuthForm from "./components/AuthForm";

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      navigate("/auth/redirect");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthLayout type="login">
      <AuthForm onSubmit={handleSubmit} loading={isLoading} showRegisterLink />
    </AuthLayout>
  );
};

export default LoginPage;
