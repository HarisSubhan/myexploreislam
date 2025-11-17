import React from 'react';
import { Container, Card, Accordion, ListGroup, Badge } from 'react-bootstrap';

const FaqsPage = () => {
  const faqs = [
    {
      question: "What is Explore Islam?",
      answer:
        "Explore Islam is an online educational platform designed to teach children aged 8–12 about Islam through animated videos, interactive lessons, and fun quizzes - all based on authentic Islamic teachings.",
    },
    {
      question: "How does the platform work?",
      answer:
        "Children watch engaging episodes featuring the characters Maryam and Muaz, who explore Islamic values, stories, and everyday situations through animated adventures. Each module ends with a quiz to help reinforce learning in a fun and easy way.",
    },
    {
      question: "Is this a good homeschooling tool?",
      answer:
        "Yes! Explore Islam is perfect for homeschooling families looking for structured, child-friendly Islamic education. Our platform covers essential Islamic topics in a way that keeps kids excited to learn, while helping parents stay involved",
    },
    {
      question: "Is the content suitable for beginners?",
      answer:
        "Yes. Whether your child is new to learning about Islam or already familiar with the basics, our platform is designed to be easy to understand, engaging, and rooted in authentic teachings - making it helpful even for families just starting their Islamic journey.",
    },
    {
      question: "What makes Explore Islam different from other platforms?",
      answer:
        "We combine visual storytelling, child-friendly language, and interactive tools in one place. The cartoon series Maryam and Muaz is unique to our platform and helps children connect emotionally with the content, while the built-in quizzes make learning active, not passive.",
    },
    {
      question: "What kind of topics are covered?",
      answer:
        "We cover topics like the Five Pillars of Islam, stories of the Prophets, good manners (Akhlaq), understanding Allah’s names, and more - all taught through storytelling, activities, and child-appropriate explanations",
    },
    {
      question: "Can parents track their child’s progress?",
      answer:
        "Yes. Parents can create a separate login to track their child’s learning progress, quiz scores,and lesson completion. This helps you stay involved in their Islamic education and support their growth.",
    },
    {
      question: "Can multiple children use the platform?",
      answer: "Yes, you can create multiple child profiles under one parent account. Each child can go through the modules at their own pace and have separate progress tracking"
    },
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