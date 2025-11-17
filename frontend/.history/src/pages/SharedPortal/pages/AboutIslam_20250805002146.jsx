import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutIslam = () => {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 style={{ color: "#fb5607" }} className="text-center fw-bold">
            About Islam
          </h2>
          <p className="lead text-center">
            A Simple, Authentic Introduction to the Faith We Teach
          </p>
          <p className="text-muted text-center">
            Islam is more than a religion – it’s a way of life built on peace,
            purpose, and connection with our Creator. Muslims believe in One
            God, <strong>Allah</strong>, and follow the teachings of His final
            messenger, Prophet Muhammad
            <span className="ms-1">ﷺ</span>, who showed us how to live with
            kindness, honesty, and compassion.
          </p>
          <p className="text-muted text-center">
            At <strong>Explore Islam</strong>, we believe Islamic learning
            should begin with love – not pressure. That’s why we’ve created a
            platform where children can explore their faith joyfully, based on
            authentic teachings.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h3
            style={{ color: "#f1066c" }}
            className="fw-semibold mb-3 text-center"
          >
            🕋 The 5 Pillars of Islam
          </h3>
          <p className="text-center text-muted">
            These core actions form the foundation of a strong and balanced
            Islamic life:
          </p>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {[
          {
            title: "Shahadah (Faith)",
            text: "Declaring with the heart and tongue that there is no god but Allah, and Muhammad ﷺ is His final messenger.",
          },
          {
            title: "Salah (Prayer)",
            text: "Performing five daily prayers to stay connected to Allah and grounded in peace and purpose.",
          },
          {
            title: "Zakah (Charity)",
            text: "Giving a portion of wealth to purify earnings and uplift the community.",
          },
          {
            title: "Sawm (Fasting)",
            text: "Fasting during Ramadan to grow in self-control, empathy, and gratitude.",
          },
          {
            title: "Hajj (Pilgrimage)",
            text: "A once-in-a-lifetime journey to Makkah (if able), uniting Muslims worldwide.",
          },
        ].map((pillar, idx) => (
          <Col md={6} lg={4} key={idx}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold">{pillar.title}</Card.Title>
                <Card.Text>{pillar.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col>
          <h3
            style={{ color: "#198754" }}
            className="fw-semibold mb-3 text-center"
          >
            🌟 The 6 Pillars of Iman (Faith)
          </h3>
          <p className="text-center text-muted">
            These beliefs shape a Muslim’s understanding of life and their
            purpose:
          </p>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {[
          "Belief in Allah – The one and only Creator, who is All-Knowing and All-Merciful.",
          "Belief in the Angels – Created by Allah to fulfill His commands.",
          "Belief in the Divine Books – Including the Qur’an, the final and preserved word of Allah.",
          "Belief in the Prophets – From Adam to Muhammad ﷺ, sent to guide humanity.",
          "Belief in the Day of Judgment – When every soul will be held accountable for its deeds.",
          "Belief in Divine Decree (Qadr) – That everything happens by Allah’s perfect wisdom.",
        ].map((item, idx) => (
          <Col md={6} key={idx}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Text>{item}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col>
          <h3 className="text-center text-warning fw-semibold">
            🌱 Why Parents Trust Us
          </h3>
          <p className="text-muted text-center">
            At Explore Islam, everything we teach is grounded in the Qur’an and
            the authentic Sunnah. We collaborate with qualified educators to
            deliver age-appropriate, truthful Islamic learning.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <p className="text-muted">
            Our animated characters, <strong>Maryam</strong> and{" "}
            <strong>Muaz</strong>, guide children through real-life situations,
            stories of the Prophets, and Islamic values in a way that’s fun and
            memorable. Each lesson includes interactive quizzes to help review
            and reinforce what they’ve learned.
          </p>
          <p className="text-muted">
            Whether you're new to Islam, rediscovering it, or building strong
            foundations for your children – this platform is for you.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4 className="text-center text-danger fw-bold">
            ❤️ Rooted in Love. Built on Authenticity.
          </h4>
          <p className="text-center text-muted">
            Explore Islam is not about overwhelming children – it’s about
            planting seeds of faith, sparking curiosity, and helping kids love
            being Muslim. We make Islamic learning joyful, meaningful, and easy
            for parents.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutIslam;
