import React from "react";
import { Container } from "react-bootstrap";
import banner from "@images/2.png";

const Banner = ({ background }) => {
  return (
    <Container
      fluid
      className="banner-container text-white text-center d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${background || banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "70vh", // Responsive height
      }}
    >
      {/* Optional: Add content here */}
    </Container>
  );
};

export default Banner;
