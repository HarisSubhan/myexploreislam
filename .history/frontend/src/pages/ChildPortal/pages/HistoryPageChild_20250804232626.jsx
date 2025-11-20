import React from "react";
import { Card } from "react-bootstrap";

const HistoryPageChild = () => {
  // Replace with actual watched history from DB
  const moduleHistory = [
    { type: "Module", title: "Pillars of Islam", date: "2025-07-15" },
    { type: "Cartoon", title: "Story of Prophet Musa", date: "2025-07-17" },
    { type: "Video", title: "Surah Al-Ikhlas", date: "2025-07-18" },
  ];

  return (
    <>
      <h3 className="mb-4">Your History</h3>
      {moduleHistory.map((item, index) => (
        <Card key={index} className="mb-3 p-3">
          <div><strong>{item.type}</strong>: {item.title}</div>
          <small className="text-muted">{item.date}</small>
        </Card>
      ))}
    </>
  );
};

export default HistoryPageChild;
