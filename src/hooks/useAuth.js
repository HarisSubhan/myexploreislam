// useAuth.js

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
// import { login as loginAction } from "../features/auth/authSlice"; // Adjust as needed
import { login as loginAction } from "../features/auth/authSlice";

export const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (authData?.user) {
      dispatch(loginAction(authData.user));
    }
    setIsLoading(false);
  }, [dispatch]);

  // Register function
  const register = async (formData) => {
    const fakeUser = {
      fullName: formData.fullName,
      email: formData.email,
      username: formData.username,
      role: "user",
    };

    localStorage.setItem("authData", JSON.stringify({ user: fakeUser }));
    dispatch(loginAction(fakeUser));
  };

  // Login function
  const login = async (credentials) => {
    const fakeUser = {
      email: credentials.email,
      role: "admin", // Or change based on role
    };
    localStorage.setItem("authData", JSON.stringify({ user: fakeUser }));
    dispatch(loginAction(fakeUser));
  };

  return { user, login, register, isLoading };
};
