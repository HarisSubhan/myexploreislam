import { Card } from "react-bootstrap";

const AuthHeader = ({ type }) => (
  <div className="text-center mb-4">
    <Card.Title as="h2" className="fw-bold mb-1">
      {type === "login" ? "Sign In" : "Create Account"}
    </Card.Title>
    <Card.Text className="text-muted">
      {type === "login" 
        ? "Enter your email and password to sign in" 
        : "Fill in your details to create an account"}
    </Card.Text>
  </div>
);

export default AuthHeader;