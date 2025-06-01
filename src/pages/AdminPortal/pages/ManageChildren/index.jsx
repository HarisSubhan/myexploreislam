import React from "react";
import { Table, Button } from "react-bootstrap";
import AdminLayout from "../../AdminApp";

const dummyChildren = [
  { id: 1, name: "Ahmed", age: 8, email: "ahmed@example.com", parent: "Ali" },
  { id: 2, name: "Ayesha", age: 10, email: "ayesha@example.com", parent: "Fatima" },
  { id: 3, name: "Zain", age: 9, email: "zain@example.com", parent: "Usman" },
];

const ManageChildren = () => {
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
            {dummyChildren.map((child, index) => (
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
