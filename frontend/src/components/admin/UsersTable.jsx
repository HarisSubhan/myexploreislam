// src/components/UsersTable.js
import { Table, Card, Badge } from "react-bootstrap";

const users = [
  {
    name: "Ahmed",
    role: "Parent",
    email: "ahmed@example.com",
    lastLogin: "2025-07-18 09:12",
    status: "Active",
    subscription: "Premium",
  },
  {
    name: "Fatima",
    role: "Child",
    email: "fatima@example.com",
    lastLogin: "2025-07-17 16:44",
    status: "Inactive",
    subscription: "Free",
  },
  {
    name: "Ali",
    role: "Parent",
    email: "ali@example.com",
    lastLogin: "2025-07-16 11:02",
    status: "Active",
    subscription: "Standard",
  },
  {
    name: "Zainab",
    role: "Child",
    email: "zainab@example.com",
    lastLogin: "2025-07-18 14:28",
    status: "Active",
    subscription: "Premium",
  },
];

const getRoleColor = (role) => {
  switch (role) {
    case "Parent":
      return "primary";
    case "Child":
      return "info";
    default:
      return "secondary";
  }
};

const getStatusColor = (status) => {
  return status === "Active" ? "success" : "danger";
};

function UsersTable() {
  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <h5 className="mb-4">All Users</h5>
        <Table striped hover responsive className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Subscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>
                  <Badge bg={getRoleColor(user.role)}>{user.role}</Badge>
                </td>
                <td>{user.email}</td>
                <td>{user.lastLogin}</td>
                <td>
                  <Badge bg={getStatusColor(user.status)}>{user.status}</Badge>
                </td>
                <td>{user.subscription}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default UsersTable;
