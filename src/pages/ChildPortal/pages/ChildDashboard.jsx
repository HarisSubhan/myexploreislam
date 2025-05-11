import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Navbar,
  FormControl,
  Button,
} from "react-bootstrap";
import logo from "@images/logo.png"; // adjusted path
import { CiBellOn, CiDark } from "react-icons/ci";

const ChildDashboard = () => {
  return (
    <Navbar bg="light" expand="lg" className="py-3">
      <Container>
        <Row className="w-100 align-items-center">
          <Col xs={6} md={4}>
            <Navbar.Brand href="#home">
              <img src={logo} alt="Company Logo" height="30" />
            </Navbar.Brand>
          </Col>
          <Col xs={6} md={8} className="d-flex justify-content-end">
            <div className="d-flex align-items-center gap-3">
              <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
              </Form>
              <CiBellOn size={24} className="cursor-pointer" />
              <CiDark size={24} className="cursor-pointer" />
              <Button variant="outline-primary">Login</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default ChildDashboard;
