import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function handlePowerOffClick() {
  alert("not implemented");
}

function App() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h1>Sky Wrangler UAV</h1>
        </Col>
      </Row>
      <Row sm={2} lg={3} xxl={4}>
        <Col>
          <Card>
            <Card.Header>Onboard Computer</Card.Header>
            <Card.Body>
              <Card.Text>Control the onboard Raspberry Pi computer.</Card.Text>
              <div className="d-grid gap-2">
                <Button variant="danger" onClick={handlePowerOffClick}>
                  Power Off
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
