import React from "react";
import { Card } from "react-bootstrap";

const NotificationPageChild = () => {
  // Replace with real data from backend or context
  const notifications = [
    { id: 1, message: "New Module unlocked: Learn Salah!", date: "2025-07-20" },
    { id: 2, message: "Reminder: Watch Surah Al-Fatiha video today", date: "2025-07-18" },
  ];

  return (
    <>
      <h3 className="mb-4">Notifications</h3>
      {notifications.map((note) => (
        <Card key={note.id} className="mb-3 p-3">
          <div><strong>{note.message}</strong></div>
          <small className="text-muted">{note.date}</small>
        </Card>
      ))}
    </>
  );
};

export default NotificationPageChild;
