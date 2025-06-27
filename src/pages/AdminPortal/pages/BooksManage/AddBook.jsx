import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        pages: "",
        file: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("author", formData.author);
        data.append("category", formData.category);
        data.append("pages", formData.pages);
        data.append("file", formData.file); // 👈 attach file

        // 🔁 Send this FormData to your backend
        console.log("Sending form with file:", data);

        // After API call
        navigate("/admin/manage-books");
    };


    return (
        <AdminLayout>
            <Card className="m-4 p-4">
                <h3 className="mb-4">➕ Add New Book</h3>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Book Title</Form.Label>
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
                        <Form.Label>Number of Pages</Form.Label>
                        <Form.Control
                            type="number"
                            name="pages"
                            value={formData.pages}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Upload Book File (PDF)</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            accept=".pdf,.doc,.docx,.epub"
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="success">
                        Add Book
                    </Button>
                </Form>
            </Card>
        </AdminLayout>
    );
};

export default AddBook;
