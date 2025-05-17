import { Link } from "react-router-dom";
import { Container, Card, Stack, Row, Col, Image } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from 'prop-types';
import AuthHeader  from '../auth/components/AuthHeader';
import logo from '@images/logo.png';

const AuthLayout = ({ children, type }) => (
  
  <Container fluid className="auth-container p-0">
    <Row className="g-0 min-vh-100">
      <Col 
        md={6} 
        className="d-none d-md-flex align-items-center justify-content-center auth-brand-section"
        style={{ background: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)" }}
      >
        <BrandSection type={type} />
      </Col>

      <Col md={6} className="d-flex align-items-center justify-content-center p-4">
      
        <AuthFormContainer type={type}>
          {children}
        </AuthFormContainer>
        
      </Col>
    </Row>
  </Container>
);

// Brand Section Component
const BrandSection = ({ type }) => (
  <div className="text-center p-5">
    <Image 
      src={logo} 
      alt="Company Logo" 
      fluid 
      style={{ maxWidth: "200px" }} 
      className="mb-4"
    />
    <h1 className="text-white mb-3">
      {type === "login" ? "Welcome Back!" : "Join Us Today"}
    </h1>
    <p className="text-white-50 lead">
      {type === "login" 
        ? "Sign in to access your personalized dashboard" 
        : "Create an account to get started"}
    </p>
  </div>
);

// Auth Form Container Component
const AuthFormContainer = ({ children, type }) => (
  <div className="w-100" style={{ maxWidth: "450px" }}>
    <Link to="/" className="text-decoration-none d-flex align-items-center mb-4 text-muted">
      <FaArrowLeft className="me-2" /> Back to home
    </Link>
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4 p-md-5">
        <AuthHeader type={type} />
        
        <div className="my-4 text-center"> {/* Added text-center here */}
          <Image 
            src={logo} 
            alt="Company Logo" 
            fluid 
            style={{ maxWidth: "200px", margin: "0 auto" }} 
            className="mb-4"
          />
          {children}
        </div>

        <AuthFooter type={type} />
        <SocialLoginSection />
      </Card.Body>
    </Card>
  </div>
);

// Auth Footer Component
const AuthFooter = ({ type }) => (
  <Stack className="text-center mt-4">
    {type === "login" ? (
      <>
        <p className="text-muted mb-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none fw-bold">
            Register
          </Link>
        </p>
        <Link 
          to="/forgot-password" 
          className="text-decoration-none text-muted small"
        >
          Forgot password?
        </Link>
      </>
    ) : (
      <p className="text-muted">
        Already registered?{" "}
        <Link to="/login" className="text-decoration-none fw-bold">
          Sign In
        </Link>
      </p>
    )}
  </Stack>
);

// Social Login Component
const SocialLoginSection = () => (
  <>
    <div className="d-flex align-items-center my-4">
      <div className="flex-grow-1 border-top"></div>
      <span className="px-3 text-muted small">or continue with</span>
      <div className="flex-grow-1 border-top"></div>
    </div>

    <div className="d-flex justify-content-center gap-3">
      <button className="btn btn-outline-secondary p-2">
        Signin With Google
      </button>
     
    </div>
  </>
);

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['login', 'register']).isRequired
};

export default AuthLayout;