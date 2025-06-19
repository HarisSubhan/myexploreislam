import React, { lazy } from "react";


const LoginPage = lazy(() => import("../pages/SharedPortal/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/SharedPortal/auth/RegisterPage"));
const RoleRedirector = lazy(() => import("@/pages/SharedPortal/auth/RoleRedirector"));

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
