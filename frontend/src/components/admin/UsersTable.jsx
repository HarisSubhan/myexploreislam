import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Badge, Spinner } from "react-bootstrap";

// Get badge color based on user role
const getRoleColor = (role) => {
  switch (role) {
    case "parent":
      return "primary";
    case "child":
      return "info";
    default:
      return "secondary";
  }
};

// Get badge color based on user status
const getActiveColor = (isActive) => {
  return isActive ? "success" : "danger";
};

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <h5 className="mb-4">All Users</h5>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
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
                    <Badge bg={getRoleColor(user.role)}>{user.role || "Child"}</Badge>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.lastLogin || "N/A"}</td>
                  <td>
                    <Badge bg={user.role === 'child' ? 'secondary' : getActiveColor(Number(user.is_active))}>
                      {user.role === 'child'
                        ? 'N/A'
                        : Number(user.is_active) === 1
                          ? 'Active'
                          : 'Inactive'}
                    </Badge>
                  </td>
                  <td>{user.subscription || "None"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default UsersTable;