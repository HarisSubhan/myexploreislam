import React from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { Link } from "react-router-dom";

const dummyBooks = [
  {
    id: 1,
    title: "The Life of Prophet Muhammad (SAW)",
    author: "Imam Ibn Kathir",
    category: "Seerah",
    pages: 250,
  },
  {
    id: 2,
    title: "Islamic Beliefs",
    author: "Dr. Bilal Philips",
    category: "Aqidah",
    pages: 180,
  },
];

const ManageBooks = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>📚 Manage Books</h2>
          <Link to="/admin/manage-books/add" className="btn btn-success">
            ➕ Add Book
          </Link>
        </div>
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
            {dummyBooks.map((book, index) => (
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
                    onClick={() => alert(`Delete Book ${book.id}`)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ManageBooks;
