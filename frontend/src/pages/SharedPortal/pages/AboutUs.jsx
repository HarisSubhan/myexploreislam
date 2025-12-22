import React from "react";
import { FaHeart, FaBookOpen, FaShieldAlt, FaStar, FaChartBar, FaSmile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const cardStyle = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 24,
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const iconWrap = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "#e6f7f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div
    style={cardStyle}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div style={iconWrap}>
      <Icon size={28} color="#00d7a9" />
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1f2937" }}>
      {title}
    </h3>
    <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6 }}>
      {description}
    </p>
  </div>
);

const AboutUs = () => {
const navigate = useNavigate();

  return (
    <div style={{ background: "linear-gradient(#ecfdf5, #ffffff)", padding: "60px 16px" }}>
      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
          Inspiring Young Hearts with the Beauty of Islam
        </h1>
        <p style={{ maxWidth: 700, margin: "0 auto 32px", fontSize: 18, color: "#4b5563" }}>
          Explore Islam is an interactive learning platform created with one purpose: to make Islamic
education engaging, accessible, and joyful for children. We believe every child should grow up
understanding their faith in a way that’s easy to connect with, age appropriate, and rooted in
authentic teachings from the Qur’an and Sunnah.
        </p>
        <button
  onClick={() => navigate("/")}
  style={{
    background: "#00d7a9",
    color: "#000000",
    padding: "14px 32px",
    borderRadius: 999,
    border: "none",
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
  }}
>
  Start Your Child’s Journey
</button>

      </section>

      {/* Authenticity */}
      <section
        style={{
          maxWidth: 1100,
          margin: "80px auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        <FeatureCard
          icon={FaBookOpen}
          title="Authentic Knowledge"
          description="All content on Explore Islam is created under the guidance of authentic Islamic knowledge,
referencing the Qur’an, Hadith, and traditional scholarship. Our team works to ensure everything
we present is both educational and age-appropriate"
        />
        <FeatureCard
          icon={FaShieldAlt}
          title="Built for Families"
          description="Our platform is designed with both children and parents in mind. While kids enjoy a safe and
interactive space to learn, parents are empowered with tools to track progress, manage access,
and feel confident about what their child is learning"
        />
        <FeatureCard
          icon={FaShieldAlt}
          title="Join the Journey"
          description="Whether you're a parent, educator, or simply someone who wants to help the next generation grow with strong faith and values, Explore Islam welcomes you. Let’s raise confident young Muslims - together"
        />
      </section>

      {/* Mission & Vision */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        <FeatureCard
          icon={FaHeart}
          title="Our Mission"
          description="To plant the seeds of faith, love for Allah, and good character in the hearts of young children
through fun, meaningful, and interactive Islamic learning."
        />
        <FeatureCard
          icon={FaStar}
          title="Our Vision"
          description="We envision a world where children across the globe are able to confidently learn and live by the teachings of Islam - not through memorization alone, but through understanding, curiosity, and joy."
        />
      </section>

      {/* What We Offer */}
      <section style={{ maxWidth: 1100, margin: "0 auto 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 40 }}>
          What We Offer
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          <FeatureCard
            icon={FaSmile}
            title="Animated Cartoons"
            description="Animated Cartoons that teach Islamic values through engaging stories."
          />
          <FeatureCard
            icon={FaStar}
            title="Interactive Assignments"
            description="Interactive Assignments to reinforce what children learn."
          />
          <FeatureCard
            icon={FaBookOpen}
            title="Quizzes & Activities"
            description="Quizzes & Activities that make learning fun and measurable."
          />
          <FeatureCard
            icon={FaChartBar}
            title="Parent Dashboard"
            description="A secure Parent Dashboard to track each child’s progress and engagement."
          />
          <FeatureCard
            icon={FaShieldAlt}
            title="Kids Dashboard"
            description="A child friendly Kids Dashboard where learning feels like playtime"
          />
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#00d7a9",
          color: "#00000",
          padding: "60px 16px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Join the Journey</h2>
        <p style={{ maxWidth: 600, margin: "0 auto 32px", fontSize: 16, opacity: 0.9 }}>
          Let’s raise confident young Muslims together — with faith, values, and joy.
        </p>
        <button
          style={{
            background: "#000000",
            color: "#00d7a9",
            padding: "14px 32px",
            borderRadius: 999,
            border: "none",
            fontSize: 18,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Get Started Today
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
