import { useState } from "react";
import { Button, Form, FloatingLabel } from "react-bootstrap";

const AuthForm = ({ onSubmit, loading, showRegisterLink = true, type = "login" }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(credentials);
      }}
    >
      <FloatingLabel controlId="email" label="Email" className="mb-3">
        
        <Form.Control
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="password" label="Password" className="mb-3">
        <Form.Control
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </FloatingLabel>
      

      <Button
       style={{
        backgroundColor: '#f1066c'
       }}
        type="submit"
        disabled={loading}
        className="w-100"
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </Form>
  );
};

export default AuthForm;
