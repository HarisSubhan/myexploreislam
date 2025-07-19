import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import { useNavigate } from "react-router-dom";
import { getCategoriesApi } from "../../../../services/categoryApi";

const AddBook = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
const [loadingCategories, setLoadingCategories] = useState(false);
const [category, setCategory] = useState("");  

useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await getCategoriesApi();  
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);
  

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        pages: "",
        thumbnail: null,
        file: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "thumbnail" || name === "file") {
            setFormData({ ...formData, [name]: files[0] });
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
        data.append("thumbnail", formData.thumbnail); 
        data.append("pdf", formData.file); 
        

        try {
            const response = await fetch("http://localhost:5000/api/books", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, 
                },
                body: data,
            });

            const resData = await response.json();

            if (!response.ok) {
                alert("Upload failed: " + resData.error);
                return;
            }

            alert("✅ Book added successfully!");
            navigate("/admin/manage-books");
        } catch (error) {
            console.error("Error uploading book:", error);
            alert("Something went wrong");
        }
    };

    return (
        <AdminLayout>
            <Card className="m-4 p-4">
                <h3 className="mb-4">➕ Add New Book</h3>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Book Title</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Author</Form.Label>
                        <Form.Control type="text" name="author" value={formData.author} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
  <Form.Label>Category</Form.Label>
  {loadingCategories ? (
    <div>Loading categories...</div>
  ) : (
    <Form.Select
      name="category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      required
    >
      <option value="">Select a category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </Form.Select>
  )}
</Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>Number of Pages</Form.Label>
                        <Form.Control type="number" name="pages" value={formData.pages} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Upload Book Thumbnail</Form.Label>
                        <Form.Control 
                            type="file" 
                            name="thumbnail" 
                            accept="image/*" 
                            onChange={handleChange} 
                            required 
                        />
                        <Form.Text className="text-muted">
                            This will be the cover image for your book
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Upload Book File</Form.Label>
                        <Form.Control 
                            type="file" 
                            name="file" 
                            accept=".pdf,.doc,.docx,.epub" 
                            onChange={handleChange} 
                            required 
                        />
                        <Form.Text className="text-muted">
                            Accepted formats: PDF, DOC, DOCX, EPUB
                        </Form.Text>
                    </Form.Group>

                    <Button type="submit" variant="success">Add Book</Button>
                </Form>
            </Card>
        </AdminLayout>
    );
};

export default AddBook;