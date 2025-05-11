import LoginPage from "../pages/SharedPortal/auth/LoginPage";
import RegisterPage from "../pages/SharedPortal/auth/RegisterPage";
import RoleRedirector from "@/pages/SharedPortal/auth/RoleRedirector";

const AuthRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
    isPublic: true,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    isPublic: true,
  },
  {
    path: "/auth/redirect",
    element: <RoleRedirector />,
    requiresAuth: true,
  },
];

export default AuthRoutes;
