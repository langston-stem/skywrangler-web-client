import React, { useReducer } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Notifications from "./notifications/Notifications";
import { nextId as nextNotificationId } from "./notifications/notification";
import { add as addNotification } from "./notifications/actions";
import notificationsReducer from "./notifications/reducer";
import NotificationsDispatch from "./notifications/NotificationsDispatch";

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
  const [notificationsState, dispatchNotifications] = useReducer(
    notificationsReducer,
    []
  );

  return (
    <NotificationsDispatch.Provider value={dispatchNotifications}>
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
                      handleShutDownClick(
                        () =>
                          dispatchNotifications(
                            addNotification({
                              id: nextNotificationId(),
                              level: "info",
                              message:
                                "Shutting down computer - please wait for green light to stop flashing before removing power.",
                              autohide: true,
                            })
                          ),
                        () =>
                          dispatchNotifications(
                            addNotification({
                              id: nextNotificationId(),
                              level: "warn",
                              message: "Failed to send shut down request.",
                            })
                          )
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
      <Notifications state={notificationsState} />
    </NotificationsDispatch.Provider>
  );
}

export default App;
