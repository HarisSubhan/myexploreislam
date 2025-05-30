import React from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../AdminApp";

const dummyBlogs = [
  {
    id: 1,
    title: "Importance of Salah in Child's Life",
    category: "Prayer",
    author: "Mufti Saad",
    date: "2025-05-28",
  },
  {
    id: 2,
    title: "Islamic Parenting Tips",
    category: "Parenting",
    author: "Ustadha Aisha",
    date: "2025-05-20",
  },
  {
    id: 3,
    title: "Why Children Love Stories of Prophets",
    category: "Stories",
    author: "Admin",
    date: "2025-05-15",
  },
];

const ManageBlogs = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">✍️ Manage Blogs</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyBlogs.map((blog, index) => (
              <tr key={blog.id}>
                <td>{index + 1}</td>
                <td>{blog.title}</td>
                <td>{blog.category}</td>
                <td>{blog.author}</td>
                <td>{blog.date}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    View
                  </Button>
                  <Button variant="warning" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
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

export default ManageBlogs;
