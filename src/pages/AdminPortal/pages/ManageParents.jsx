// import React from 'react';
// import { Table, Button } from 'react-bootstrap';
// import AdminLayout from '../AdminApp';

// const dummyParents = [
//   { id: 1, name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '1234567890', status: 'Active' },
//   { id: 2, name: 'Sara Ali', email: 'sara@example.com', phone: '0987654321', status: 'Inactive' },
// ];

// const ManageParents = () => {
//   return (
//     <AdminLayout>
//       <div className="p-4">
//         <h2 className="mb-4">👪 Manage Parents</h2>
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Parent Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dummyParents.map((parent, index) => (
//               <tr key={parent.id}>
//                 <td>{index + 1}</td>
//                 <td>{parent.name}</td>
//                 <td>{parent.email}</td>
//                 <td>{parent.phone}</td>
//                 <td>{parent.status}</td>
//                 <td>
//                   <Button variant="primary" size="sm" className="me-2">Edit</Button>
//                   <Button variant="danger" size="sm">Delete</Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ManageParents;


import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import AdminLayout from "../AdminApp";

const ManageParents = () => {
  const [parents, setParents] = useState([
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "03001234567",
    },
    {
      id: 2,
      name: "Ayesha Fatima",
      email: "ayesha@example.com",
      phone: "03111234567",
    },
  ]);

  const [selectedParent, setSelectedParent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (parent) => {
    setSelectedParent(parent);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this parent?");
    if (confirmDelete) {
      setParents(parents.filter((parent) => parent.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="mb-4">👪 Manage Parents</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent, index) => (
              <tr key={parent.id}>
                <td>{index + 1}</td>
                <td>{parent.name}</td>
                <td>{parent.email}</td>
                <td>{parent.phone}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleView(parent)}>
                    👁️ View
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(parent.id)}>
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* View Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Parent Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedParent && (
              <div>
                <p><strong>Name:</strong> {selectedParent.name}</p>
                <p><strong>Email:</strong> {selectedParent.email}</p>
                <p><strong>Phone:</strong> {selectedParent.phone}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageParents;
