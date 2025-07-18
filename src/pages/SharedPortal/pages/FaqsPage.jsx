import React from 'react';
import { Container, Card, Accordion, ListGroup, Badge } from 'react-bootstrap';

const FaqsPage = () => {
  const faqs = [
    {
      question: "Why is the sky blue?",
      answer: "The sky looks blue because sunlight gets scattered in all directions by the gases in our atmosphere. Blue light scatters more than other colors because it travels as shorter waves!"
    },
    {
      question: "How do birds fly?",
      answer: "Birds fly by flapping their wings, which pushes air downward and lifts them up. Their light bones, strong muscles, and special feather shapes all help them stay in the air!"
    },
    {
      question: "Why do we need to sleep?",
      answer: "Sleep helps our bodies and brains grow and recharge. While we sleep, our bodies repair themselves and our brains organize all the things we learned during the day!"
    },
    {
      question: "Where does the sun go at night?",
      answer: "The sun doesn't actually go anywhere! It stays in place while our planet Earth spins around. When our part of Earth turns away from the sun, it becomes night time for us."
    },
    {
      question: "Why do we have to eat vegetables?",
      answer: "Vegetables are packed with vitamins and minerals that help us grow strong and stay healthy. They're like nature's magic potions that give us superpowers against germs!"
    }
  ];

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">
        <div 
    style={{ 
      backgroundColor: "#FB5607",
      width: "fit-content",
      maxWidth: "100%",
      minWidth: "300px",
      padding: "0.75rem 1.5rem",
      fontSize: "calc(1.325rem + 0.9vw)",
      color: "white",
      margin: "0 auto",
      borderRadius: "0.375rem"
    }}
  >Curious Kids' Corner</div>
        
      </h1>
      <p className="text-center fs-4 mb-5 text-muted">
        Answers to your most wonder-filled questions!
      </p>

      <Accordion defaultActiveKey="0" className="mb-5">
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={index.toString()} key={index} className="mb-3">
            <Accordion.Header>
              <span className="fw-bold text-primary">Q:</span> {faq.question}
            </Accordion.Header>
            <Accordion.Body className="fs-5">
              <span className="fw-bold text-success">A:</span> {faq.answer}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Card className="text-center bg-light">
        <Card.Body>
          <Card.Text className="fs-5 fst-italic">
            Have more questions? Ask your parents or teachers - they love helping curious minds like yours!
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FaqsPage;