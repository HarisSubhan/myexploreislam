import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

const HelpPageChild = () => {
  return (
    <div>
      <h3 className="mb-4">Need Help?</h3>
      <p>Here are some frequently asked questions to assist you in using the Explore Islam dashboard:</p>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>How do I start a module?</Accordion.Header>
          <Accordion.Body>
            Navigate to the "Modules" section from the sidebar and click on any module to start learning. Videos and activities will be unlocked step by step.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>How will I know if there’s something new?</Accordion.Header>
          <Accordion.Body>
           New content or reminders will appear in the "Inbox" section. Make sure to check it regularly!
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Who can I contact if I need help?</Accordion.Header>
          <Accordion.Body>
            Ask your parent/guardianfor help and if there is a problem, your parent/guardian can submit a ticket.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default HelpPageChild;
