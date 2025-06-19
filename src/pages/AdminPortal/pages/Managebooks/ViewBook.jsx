import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import AdminLayout from "../../AdminApp";

const ViewBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 📦 Replace with actual API call
    const fetchBook = async () => {
      const dummyData = {
        title: "Understanding Islam",
        author: "Ustad Ahmed",
        category: "Aqidah",
        pages: 150,
        fileUrl: "https://example.com/book.pdf",
      };
      setBook(dummyData);
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <Card className="p-4 shadow-sm">
          <h2 className="mb-3">📖 {book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Pages:</strong> {book.pages}</p>
          <p>
            <strong>File:</strong>{" "}
            <a href={book.fileUrl} target="_blank" rel="noreferrer">
              View / Download
            </a>
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewBook;
