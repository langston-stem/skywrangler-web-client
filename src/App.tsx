import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OnboardComputerCard from "./cards/onboardComputer/OnboardComputerCard";
import { fromEvent, Unsubscribable } from "rxjs";
import ReconnectingEventSource from "reconnecting-eventsource";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const [connectionOk, setConnectionOk] = useState(false);

  useEffect(() => {
    const eventSource = new ReconnectingEventSource("/api/status");
    const subscriptions = new Array<Unsubscribable>();
    subscriptions.push(
      fromEvent(eventSource, "open").subscribe({
        next: (ev) => setConnectionOk(true),
      })
    );
    subscriptions.push(
      fromEvent(eventSource, "error").subscribe({
        next: (ev) => setConnectionOk(false),
      })
    );
    subscriptions.push(
      fromEvent(eventSource, "heartbeat").subscribe({
        next: (ev) => console.info(ev),
      })
    );
    return () => {
      subscriptions.forEach((s) => s.unsubscribe());
      eventSource.close();
    };
  }, [setConnectionOk]);

  return (
    <ChakraProvider>
      <Container fluid>
        <Row>
          <Col>
            <h1>Sky Wrangler UAV</h1>
          </Col>
        </Row>
        <Row sm={2} lg={3} xxl={4}>
          <Col>
            <OnboardComputerCard isConnected={connectionOk} />
          </Col>
        </Row>
      </Container>
    </ChakraProvider>
  );
}

export default App;
