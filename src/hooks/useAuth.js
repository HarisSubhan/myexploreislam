import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage or sessionStorage for auth data
    const authData = JSON.parse(localStorage.getItem("authData"));
    setUser(authData?.user || null);
    setIsLoading(false);
  }, []);

  return { user, isLoading };
};
