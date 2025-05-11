import { Link } from "react-router-dom";
import AuthHeader from "./components/AuthHeader";
import { Container, Card, Stack } from "react-bootstrap";

const AuthLayout = ({ children, type }) => (
  <Container
    fluid
    className="min-vh-100 d-flex align-items-center bg-light p-4"
  >
    <Card className="w-100" style={{ maxWidth: "400px" }}>
      <Card.Body className="p-4">
        <AuthHeader type={type} />
        <div className="my-4">{children}</div>
        <Stack className="text-center text-muted">
          {type === "login" ? (
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          ) : (
            <p>
              Already registered? <Link to="/login">Sign In</Link>
            </p>
          )}
        </Stack>
      </Card.Body>
    </Card>
  </Container>
);

export default AuthLayout;
