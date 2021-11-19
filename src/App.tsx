import React, { useReducer } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Notifications from "./notifications/Notifications";
import notificationsReducer from "./notifications/reducer";
import NotificationsDispatch from "./notifications/NotificationsDispatch";
import OnboardComputerCard from "./cards/onboardComputer/OnboardComputerCard";

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
            <OnboardComputerCard />
          </Col>
        </Row>
      </Container>
      <Notifications state={notificationsState} />
    </NotificationsDispatch.Provider>
  );
}

export default App;
