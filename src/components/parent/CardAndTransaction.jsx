import React from 'react';
import { Card, Table, Container, Row, Col, Badge } from 'react-bootstrap';
import { FiCreditCard, FiCalendar, FiDollarSign, FiCheckCircle, FiClock } from 'react-icons/fi';

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
    <Container  className="my-4 px-2 px-md-3">
      {/* Credit Card Section */}
      <Row className="mb-4 g-3">
        <Col xs={12} md={6} lg={5} xl={4}>
          <Card className="border-0 shadow-sm" style={{
            background: 'linear-gradient(135deg, #b7d3a8 0%, #f7e4ad 100%)',
            borderRadius: '16px',
            overflow: 'hidden',
            minHeight: '180px'
          }}>
            <Card.Body className="p-3 p-md-4 position-relative">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <div className="text-muted small mb-1">Card Number</div>
                  <h3 className="mb-0 fs-5 fw-bold">5762 **** **** **45</h3>
                </div>
                <img
                  src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
                  alt="Mastercard"
                  width="40"
                />
              </div>
              
              <Row className="g-3">
                <Col xs={6}>
                  <div className="text-muted small">Cardholder Name</div>
                  <div className="fw-medium">John Doe</div>
                </Col>
                <Col xs={6}>
                  <div className="text-muted small">Valid Thru</div>
                  <div className="fw-medium">10/26</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transactions Section */}
      <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-2 p-md-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0 fs-5 fw-semibold">Transaction Details</Card.Title>
                <div className="text-muted small">2 transactions</div>
              </div>

              {/* Desktop Table */}
              <div className="d-none d-md-block">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Card</th>
                      <th>Expiry</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Paid Date</th>
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
                        <td className="fw-medium">{tx.amount}</td>
                        <td>{tx.paidDate || '-'}</td>
                        <td>
                          <Badge bg={tx.status === 'Paid' ? 'success' : 'danger'} className="d-flex align-items-center gap-1">
                            {tx.status === 'Paid' ? <FiCheckCircle size={14} /> : <FiClock size={14} />}
                            {tx.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="d-md-none">
                {transactions.map((tx) => (
                  <Card key={tx.id} className="mb-3 border-0 shadow-sm">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="fw-medium">Transaction #{tx.id}</div>
                        <Badge bg={tx.status === 'Paid' ? 'success' : 'danger'}>
                          {tx.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-2">
                        <div className="text-muted small">Card Number</div>
                        <div>{tx.cardNumber}</div>
                      </div>
                      
                      <Row className="g-2 mb-2">
                        <Col xs={6}>
                          <div className="text-muted small">Expiry</div>
                          <div>{tx.expiry}</div>
                        </Col>
                        <Col xs={6}>
                          <div className="text-muted small">Due Date</div>
                          <div>{tx.dueDate}</div>
                        </Col>
                      </Row>
                      
                      <Row className="g-2">
                        <Col xs={6}>
                          <div className="text-muted small">Amount</div>
                          <div className="fw-medium">{tx.amount}</div>
                        </Col>
                        <Col xs={6}>
                          <div className="text-muted small">Paid Date</div>
                          <div>{tx.paidDate || '-'}</div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CardAndTransaction;