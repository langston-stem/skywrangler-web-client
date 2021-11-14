import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

async function handleShutDownClick(onSuccess: () => void, onError: () => void) {
  try {
    const response = await fetch("/api/shutdown", {
      method: "POST",
    });
    if (response.ok) {
      onSuccess();
    } else {
      console.error(
        `handleShutDownClick response error: (${response.status}) ${response.statusText}`
      );
      onError();
    }
  } catch (err) {
    console.error(`error in handleShutDownClick: ${err}`);
    onError();
  }
}

function App() {
  const [showShutDownInfo, setShowShutDownInfo] = useState(false);
  const [showShutDownError, setShowShutDownError] = useState(false);

  return (
    <>
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
                <Card.Text>
                  Control the onboard Raspberry Pi computer.
                </Card.Text>
                <div className="d-grid gap-2">
                  <Button
                    variant="danger"
                    onClick={() => {
                      setShowShutDownInfo(false);
                      setShowShutDownError(false);
                      handleShutDownClick(
                        () => setShowShutDownInfo(true),
                        () => setShowShutDownError(true)
                      );
                    }}
                  >
                    Shut down
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="info"
          onClose={() => setShowShutDownInfo(false)}
          show={showShutDownInfo}
          delay={30 * 1000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Information</strong>
          </Toast.Header>
          <Toast.Body>
            Shutting down computer - please wait for green light to stop
            flashing before removing power.
          </Toast.Body>
        </Toast>
        <Toast
          bg="warning"
          onClose={() => setShowShutDownError(false)}
          show={showShutDownError}
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>Failed to send shut down request.</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
