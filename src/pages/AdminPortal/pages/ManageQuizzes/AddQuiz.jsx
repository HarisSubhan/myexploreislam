// import React, { useState } from 'react';
// import { Form, Button } from 'react-bootstrap';
// import AdminLayout from '../../AdminApp';

// const AddQuiz = () => {
//   const [quiz, setQuiz] = useState({
//     title: '',
//     category: '',
//     totalQuestions: '',
//   });

//   const handleChange = (e) => {
//     setQuiz({ ...quiz, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Quiz Data:', quiz);
//     // Yahan API call karni hogi baad mein
//     alert('Quiz added successfully!');
//   };

//   return (
//     <AdminLayout>
//       <div className="p-4">
//         <h2 className="mb-4">➕ Add New Quiz</h2>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Quiz Title</Form.Label>
//             <Form.Control
//               type="text"
//               name="title"
//               value={quiz.title}
//               onChange={handleChange}
//               required
//               placeholder="Enter quiz title"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Category</Form.Label>
//             <Form.Control
//               type="text"
//               name="category"
//               value={quiz.category}
//               onChange={handleChange}
//               required
//               placeholder="Enter category"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Total Questions</Form.Label>
//             <Form.Control
//               type="number"
//               name="totalQuestions"
//               value={quiz.totalQuestions}
//               onChange={handleChange}
//               required
//               placeholder="Enter number of questions"
//             />
//           </Form.Group>

//           <Button variant="success" type="submit">
//             Add Quiz
//           </Button>
//         </Form>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AddQuiz;


import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import AdminLayout from "../../AdminApp";

const AddQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [linkType, setLinkType] = useState("");
  const [linkOptions, setLinkOptions] = useState([]);
  const [selectedLink, setSelectedLink] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correct: "",
    },
  ]);

  useEffect(() => {
    if (linkType === "Video") {
      setLinkOptions(["Salah Video", "Prophets Series"]);
    } else if (linkType === "Category") {
      setLinkOptions(["Prayer", "Stories", "Aqidah"]);
    } else if (linkType === "Assignment") {
      setLinkOptions(["Homework 1", "Homework 2"]);
    } else {
      setLinkOptions([]);
    }
  }, [linkType]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "correct") {
      updatedQuestions[index].correct = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct: "" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ quizTitle, linkType, selectedLink, questions });
    // Submit logic here (API call)
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">📝 Add Quiz</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Quiz Title</Form.Label>
            <Form.Control
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Link Quiz To</Form.Label>
                <Form.Select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value)}
                >
                  <option value="">-- Select Type --</option>
                  <option value="Video">Video</option>
                  <option value="Category">Category</option>
                  <option value="Assignment">Assignment</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Target</Form.Label>
                <Form.Select
                  value={selectedLink}
                  onChange={(e) => setSelectedLink(e.target.value)}
                >
                  <option value="">-- Select Target --</option>
                  {linkOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mt-4">Questions</h5>
          {questions.map((q, index) => (
            <Card className="mb-3" key={index}>
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Question {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    required
                  />
                </Form.Group>

                {q.options.map((opt, i) => (
                  <Form.Group className="mb-2" key={i}>
                    <Form.Label>Option {String.fromCharCode(65 + i)}</Form.Label>
                    <Form.Control
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleQuestionChange(index, `option${i}`, e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                ))}

                <Form.Group>
                  <Form.Label>Correct Option</Form.Label>
                  <Form.Select
                    value={q.correct}
                    onChange={(e) =>
                      handleQuestionChange(index, "correct", e.target.value)
                    }
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          ))}

          <Button variant="secondary" onClick={addQuestion} className="mb-3">
            ➕ Add Another Question
          </Button>

          <br />
          <Button variant="success" type="submit">
            ✅ Create Quiz
          </Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AddQuiz;
