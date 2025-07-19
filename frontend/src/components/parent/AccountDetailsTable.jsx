import React from 'react';
import { Table, Button, Container, Card } from 'react-bootstrap';

const AccountDetailsTable = () => {
  return (
    <Container className="my-4">
      <Card className="shadow-sm rounded-3">
        <Card.Body>
          <h2 className="mb-3 fs-4">Primary Account Holder</h2>
          <p className="mb-4 text-muted">Accounts Details</p>

          <div className="table-responsive">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Sr No.</th>
                  <th scope="col">Account Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Additional Charges</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Sub Account Detail 01</td>
                  <td>
                    <span className="badge bg-success">Active</span>
                  </td>
                  <td>USD $0.00</td>
                  <td>
                    <Button variant="outline-danger" size="sm">
                      Deactivate
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccountDetailsTable;
