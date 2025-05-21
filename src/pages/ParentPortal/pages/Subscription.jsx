import React from 'react'
import { Button, Col, Row, Container } from 'react-bootstrap'

const Subscription = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Subscription 02</h2>
          <p>What’s included</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus fugiat assumenda voluptas similique aliquid numquam
            aut fugit voluptatem, eaque repellendus illo repudiandae minus porro
            ullam odit ex repellat! Harum, natus.
          </p>
        </Col>
        <Col>
          <h2>$50</h2>
          <Button style={{backgroundColor:"#F1066C"}}>Add To Cart</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Subscription
