import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    axios
      .get("/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
        setLoading(false);
      });
  }, []);

  // Handle Delete
  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this book?");
    if (confirm) {
      axios
        .delete(`/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          setBooks(books.filter((book) => book.id !== id));
        })
        .catch((err) => {
          console.error("Failed to delete book", err);
        });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>📚 Manage Books</h2>
          <Link to="/admin/manage-books/add" className="btn btn-success">
            ➕ Add Book
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.pages}</td>
                  <td>
                    <Link
                      to={`/admin/manage-books/view/${book.id}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/admin/manage-books/edit/${book.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageBooks;
