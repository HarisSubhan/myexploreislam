import React from 'react'
import { Button, Card } from 'react-bootstrap'
import Banner from './Banner';

const QuizStart = () => {
  return (
    <Container>
      <p>3/5</p>
      <Card>
        <h2>The logo For Luxury Car Maker Porsche Features Which Animal?</h2>
        <div className="d-flex">
          <div>
            <div className="d-flex">
              <div>A</div>
              <div>Dog</div>
            </div>
            <div className="d-flex">
              <div>B</div>
              <div>tiger</div>
            </div>
            <div className="d-flex">
              <div>C</div>
              <div>Cat</div>
            </div>
            <div className="d-flex">
              <div>C</div>
              <div>Dog</div>
            </div>
            <div className="d-flex">
              <div>D</div>
              <div>horse</div>
            </div>
          </div>
          <div></div>
        </div>
        <div className="d-flex">
            <Button>Next Question</Button>
        </div>
      </Card>
    </Container>
  );
}

export default QuizStart