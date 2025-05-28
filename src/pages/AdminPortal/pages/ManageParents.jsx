import React from 'react';
import { Table, Button } from 'react-bootstrap';
import AdminLayout from '../AdminApp';

const dummyParents = [
  { id: 1, name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '1234567890', status: 'Active' },
  { id: 2, name: 'Sara Ali', email: 'sara@example.com', phone: '0987654321', status: 'Inactive' },
];

const ManageParents = () => {
  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">👪 Manage Parents</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Parent Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyParents.map((parent, index) => (
              <tr key={parent.id}>
                <td>{index + 1}</td>
                <td>{parent.name}</td>
                <td>{parent.email}</td>
                <td>{parent.phone}</td>
                <td>{parent.status}</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">Edit</Button>
                  <Button variant="danger" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ManageParents;
