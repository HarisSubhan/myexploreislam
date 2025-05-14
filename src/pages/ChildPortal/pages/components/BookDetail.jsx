// import React from "react";
// import { Button } from "react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";

// function BookDetail() {
//   const navigate = useNavigate();
//   const { bookId } = useParams();

//   return (
//     <div className="container py-4">
//       <Button onClick={() => navigate(-1)} variant="secondary" className="mb-4">
//         Back to Home
//       </Button>
//       <h1>Book Details for ID: {bookId}</h1>
//       <p>This is the detail page for book with ID: {bookId}</p>
//     </div>
//   );
// }

// export default BookDetail; // Make sure this line exists
import React from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BookDetail() {
  const navigate = useNavigate();
  // const { bookId } = useParams();

  // Mock data based on the image
  const bookData = {
    title: "The Eye of the World",
    series: "Wheel of Time, Book 1",
    edition: "1st mass market ed.",
    author: "Robert Jordan",
    rating: "★★★★★ 3.9 (180 ratings)",
    stats: "2,009 Want to read · 229 Currently reading · 281 Have read",
    description:
      "In the Third Age, an age of prophecy when the world and time themselves hang in the balance, the Dark One, imprisoned by the Creator, is stirring in Shayol Ghul.",
    publishDate: "1990",
    publisher: "T. Doherty Associates, Turtleback Books",
    language: "English",
    pages: "814",
    previewLanguages: ["French", "English"],
    subjects: [
      "series:The Wheel of Time",
      "Fantasy fiction",
      "Rand al'Thor (Fictitious character)",
      "Fiction",
      "Reader...",
    ],
    lastEdited: "January 21, 2025",
    editionsCount: 70,
    availableAt: ["Library.link", "WorldCat"],
    buyLinks: ["Better World Books", "Amazon", "More"],
  };

  return (
    <div className="container py-4">
      <Button onClick={() => navigate(-1)} variant="secondary" className="mb-4">
        Back to Home
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Card.Title as="h1">{bookData.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {bookData.series}
              </Card.Subtitle>
              <Card.Text className="text-muted">{bookData.edition}</Card.Text>
              <Card.Text>by {bookData.author}</Card.Text>
            </div>
            <div className="text-end">
              <div>{bookData.rating}</div>
              <small className="text-muted">{bookData.stats}</small>
            </div>
          </div>

          <Card.Text className="mb-4">{bookData.description}</Card.Text>

          <div className="d-flex gap-3 mb-3">
            <Button variant="primary">Search Inside</Button>
            <Button variant="outline-primary">Want to Read</Button>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Publish Date:</strong> {bookData.publishDate}
              </p>
              <p>
                <strong>Publisher:</strong> {bookData.publisher}
              </p>
              <p>
                <strong>Language:</strong> {bookData.language}
              </p>
              <p>
                <strong>Pages:</strong> {bookData.pages}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Previews available in:</strong>{" "}
                {bookData.previewLanguages.join(", ")}
              </p>
              <div>
                <strong>Subjects:</strong>{" "}
                {bookData.subjects.map((subject, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-1">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <small className="text-muted">
              Last edited by {bookData.lastEdited} | <a href="#">History</a> |{" "}
              <a href="#">Edit</a>
            </small>
          </div>

          <div className="mb-3">
            <h5>Check nearby libraries</h5>
            <ul className="list-unstyled">
              {bookData.availableAt.map((lib, index) => (
                <li key={index}>
                  <a href="#">{lib}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5>Buy this book</h5>
            <ul className="list-unstyled">
              {bookData.buyLinks.map((link, index) => (
                <li key={index}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
            <small className="text-muted">When you buy books using these</small>
          </div>
        </Card.Body>
      </Card>

      <div className="text-end">
        <small className="text-muted">
          Showing 10 featured editions.{" "}
          <a href="#">View all {bookData.editionsCount} editions?</a>
        </small>
      </div>
    </div>
  );
}

export default BookDetail;
