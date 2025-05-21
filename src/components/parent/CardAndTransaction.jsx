import React from 'react';
import { Card, Table, Container, Row, Col } from 'react-bootstrap';

const transactions = [
  {
    id: 1,
    cardNumber: '5762 **** **** **45',
    expiry: '10/26',
    dueDate: '01/05/2025',
    amount: '$17.00',
    paidDate: '',
    status: 'Unpaid',
  },
  {
    id: 2,
    cardNumber: '5762 **** **** **45',
    expiry: '10/26',
    dueDate: '01/04/2025',
    amount: '$17.00',
    paidDate: '29/03/2025',
    status: 'Paid',
  },
];

const CardAndTransaction = () => {
  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col md={6}>
          <div
            style={{
              background: 'linear-gradient(to right, #b7d3a8, #f7e4ad)',
              borderRadius: '16px',
              padding: '20px',
              width: '60%',
              height:"200px",
              color: '#000',
              position: 'relative',
              minHeight: '150px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              5762 **** **** **45
            </div>
            <div className="mt-3">
              <div>Cardholder Name: <strong>John Doe</strong></div>
              <div>Valid Upto: <strong>10/26</strong></div>
            </div>
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <img
                src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                alt="Mastercard"
                width="50"
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Transaction Details</Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Card Number</th>
                    <th>Expiry Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Date Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>{tx.cardNumber}</td>
                      <td>{tx.expiry}</td>
                      <td>{tx.dueDate}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.paidDate || '-'}</td>
                      <td>
                        <span
                          style={{
                            color: tx.status === 'Paid' ? 'green' : 'red',
                            fontWeight: 'bold',
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CardAndTransaction;
