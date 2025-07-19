import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";
import axios from "axios";

const ManageChildren = () => {

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/admin/children", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // use your token logic
        },
      })
      .then((res) => {
        setChildren(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching children:", err);
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">👶 Manage Children</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Parent Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child, index) => (
              <tr key={child.id}>
                <td>{index + 1}</td>
                <td>{child.name}</td>
                <td>{child.age}</td>
                <td>{child.email}</td>
                <td>{child.parent}</td>
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

export default ManageChildren;
