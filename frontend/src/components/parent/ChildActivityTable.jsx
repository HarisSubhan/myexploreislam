import React from "react";
import { Card, Table } from "react-bootstrap";

export default function ChildActivityTable({ data, loading }) {
  return (
    <Card className="pd-card">
      <Card.Body>
        <h5 className="section-title">Child Activity Details</h5>
        {loading ? (
          <div className="skeleton" style={{ height: 160 }} />
        ) : (
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Child</th>
                <th>Current Video</th>
                <th>Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {data.map(child => (
                <tr key={child.id}>
                  <td>{child.name}</td>
                  <td>{child.video}</td>
                  <td>
                    <span
                      className={`badge ${
                        child.status === "Watching" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {child.status}
                    </span>
                  </td>
                  <td>{child.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
