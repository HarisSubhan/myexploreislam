import React from 'react';
import { Container, Card, Accordion, ListGroup, Badge } from 'react-bootstrap';

const FaqsPage = () => {
  const faqs = [
    {
      question: "What is Explore Islam?",
      answer:
        "Explore Islam is an interactive online learning platform that helps children learn Islam in a fun and engaging way. Through animated lessons, written modules, activities, and quizzes, kids builda strong foundation in their faith while learning in a safe and kid friendly space.",
    },
    {
      question: "How does the platform work?",
      answer:
        "Parents subscribe and create child profiles from their Parent Dashboard. Each child receives their own Kid Dashboard, where they can watch lessons, complete modules, read the content, and take quizzes. All progress is saved, and parents can track scores, time spent, and completed learning anytime.",
    },
    {
      question: "Is this a good homeschooling tool?",
      answer:
        "Yes. Explore Islam is an excellent supplement for homeschooling families. The structured modules, step by step lessons, and interactive exercises make it easy to include Islamic studies in a child’s daily routine. Parents can monitor learning and ensure their child is progressing at a healthy pace.",
    },
    {
      question: "Is the content suitable for beginners?",
      answer:
        "Absolutely. Our lessons are designed for children with little to no prior Islamic education. Concepts are introduced using simple explanations, clear visuals, and age appropriate examples so beginners can understand and enjoy the learning process",
    },
    {
      question: " Is the content tailored to different age groups?",
      answer:
        "Yes. Explore Islam adjusts content based on your child’s age. Younger children receive simpler explanations and shorter activities, while older children receive deeper lessons, broader topics, and more challenging quizzes. This ensures every child learns at the level that suits them best.",
    },
    {
      question: "What makes Explore Islam different from other platforms?",
      answer:
        "Explore Islam combines authentic Islamic knowledge with a child focused learning experience. Every lesson is based on the Quran and Sunnah and taught through animations, activities, and quizzes that keep children engaged. The platform also includes a Parent Dashboard that lets families stay involved and track progress easily.",
    },
    {
      question: "What kind of topics are covered?",
      answer:
        "Explore Islam includes foundational Islamic topics such as prayer, wudu, Islamic manners and character, tawhid, pillars of Islam and iman, and lessons from the Quran and Sunnah. Each topic is taught using a mix of videos, written content, assignments, and quizzes to help children understand and remember what they learn",
    },
    {
      question: "Can parents track their child’s progress?",
      answer:
        "Yes. Parents can view completed lessons, quiz scores, time spent learning, and areas where their child may need more support.",
    },
    {
      question: "Can multiple children use the platform?",
      answer:
        "Yes. One parent account can include multiple children. Each child has their own personalized Kid Dashboard and progress tracking.",
    },
    {
      question: "Is the platform helpful for families new to practicing Islam?",
      answer : "Yes. Explore Islam is designed to support families at every stage of their journey. Lessons are simple, clear, and practical, making it easy for both parents and children who are new to Islamic learning to grow with confidence."
     },
     {
      question: "Is the platform mobile friendly?",
      answer : "Yes. Explore Islam works on phones, tablets, and computers, so children can learn anytime and anywhere."
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