import React, { useEffect, useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../AdminApp";

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    pages: "",
    file: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get book data
    const fetchBook = async () => {
      // 🟡 Replace with your actual API call
      const book = {
        title: "Understanding Islam",
        author: "Ustad Ahmed",
        category: "Aqidah",
        pages: 150,
      };
      setFormData({ ...book, file: null });
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("pages", formData.pages);
    if (formData.file) {
      data.append("file", formData.file);
    }

    // 🟢 Send this data to backend using fetch or axios
    console.log("FormData to send:", formData);

    // 👇 Simulate success
    alert("Book updated successfully!");
    navigate("/admin/manage-books");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4 text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <Card className="p-4 shadow-sm">
          <h2 className="mb-4">📘 Edit Book</h2>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pages</Form.Label>
              <Form.Control
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Replace File (optional)</Form.Label>
              <Form.Control
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.epub"
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Update Book
            </Button>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EditBook;
