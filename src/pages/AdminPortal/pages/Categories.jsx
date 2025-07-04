import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import AdminLayout from "../AdminApp";
import {
  getCategoriesApi,
  updateCategoryApi,
  deleteCategoryApi,
  createCategoryApi,
} from "../../../services/categoryApi";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        console.error("Invalid response:", res);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAdd = async () => {
    if (newCategory.trim() === "") return;

    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, { name: newCategory });
      } else {
        await createCategoryApi({ name: newCategory });
      }

      setNewCategory("");
      setEditingCategory(null);
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setNewCategory(cat.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategoryApi(id);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">📂 Manage Categories</h2>

        <Button
          variant="primary"
          className="mb-3"
          onClick={() => {
            setNewCategory("");
            setEditingCategory(null);
            setShowModal(true);
          }}
        >
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
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal for Add/Edit */}
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
