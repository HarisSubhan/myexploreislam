import React, { useState } from "react";
import toast from "react-hot-toast";
import { Container, Form, Button, Card } from "react-bootstrap";
import { requestedChildApi } from "../../services/parentApi";

const RequestChild = () => {
  const [requestedChildren, setRequestedChildren] = useState("");
  const parentId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestedChildren || Number(requestedChildren) <= 0) {
      toast.error("Please enter a valid number of children.");
      return;
    }

    try {
      const requestData = {
        parent_id: parentId,
        requested_children: Number(requestedChildren),
      };

      await requestedChildApi(requestData);
      setRequestedChildren("");
      toast.success("Request submitted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to send request.");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h3 className="mb-4">Request Children</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="requestedChildren" className="mb-3">
            <Form.Label>Number of Children</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number"
              value={requestedChildren}
              onChange={(e) => setRequestedChildren(e.target.value)}
              min="1"
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Send Request
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default RequestChild;