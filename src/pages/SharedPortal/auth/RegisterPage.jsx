// RegisterPage.js

import React, { useState } from "react";
import AuthLayout from "../auth/AuthLayout";
import RegisterForm from "../auth/components/RegisterForm";
import { useAuth } from "../../../hooks/useAuth";

const RegisterPage = () => {
  const { register } = useAuth();  // Use the register function from useAuth
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);

    // Call register method from useAuth
    await register(formData);

    setLoading(false);
  };

  return (
    <AuthLayout type="register">
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </AuthLayout>
  );
};

export default RegisterPage;
