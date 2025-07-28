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

        <Accordion.Item eventKey="1">
          <Accordion.Header>Where can I see what I have watched?</Accordion.Header>
          <Accordion.Body>
            Visit the "History" section from the sidebar. You'll see the list of modules, cartoons, and videos you’ve previously accessed.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>How will I know if there’s something new?</Accordion.Header>
          <Accordion.Body>
            New content or reminders will appear in the "Notifications" section. Make sure to check it regularly!
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Who can I contact if I need help?</Accordion.Header>
          <Accordion.Body>
            You can contact your teacher or guardian, or click the contact icon (if available) to reach out to support.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default HelpPageChild;
