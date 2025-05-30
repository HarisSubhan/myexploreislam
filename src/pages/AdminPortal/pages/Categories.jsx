import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import AdminLayout from "../AdminApp";

const ManageCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Qur'an" },
    { id: 2, name: "Prophet Stories" },
    { id: 3, name: "Salah Lessons" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAdd = () => {
    if (newCategory.trim() === "") return;
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: newCategory } : cat
        )
      );
      setEditingCategory(null);
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), name: newCategory },
      ]);
    }
    setNewCategory("");
    setShowModal(false);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setNewCategory(cat.name);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">📂 Manage Categories</h2>
        <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
          ➕ Add Category
        </Button>

        <Table bordered striped hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCategory ? "Edit Category" : "Add Category"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="categoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleAdd}>
              {editingCategory ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageCategories;
