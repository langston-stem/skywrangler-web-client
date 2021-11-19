import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useCallback, useContext } from "react";
import NotificationsDispatch from "../../notifications/NotificationsDispatch";
import { nextId as nextNotificationId } from "../../notifications/notification";
import { add as addNotification } from "../../notifications/actions";

const handleShutDownClick = () =>
  new Promise<void>(async (resolve, reject) => {
    try {
      const response = await fetch("/api/shutdown", {
        method: "POST",
      });
      if (response.ok) {
        resolve();
      } else {
        console.error(
          `handleShutDownClick response error: (${response.status}) ${response.statusText}`
        );
        reject(response);
      }
    } catch (err) {
      console.error(`error in handleShutDownClick: ${err}`);
      reject(err);
    }
  });

const addShutdownSuccessNotification = () =>
  addNotification({
    id: nextNotificationId(),
    level: "info",
    message:
      "Shutting down computer - please wait for green light to stop flashing before removing power.",
    autohide: true,
  });

const addShutdownFailureNotification = () =>
  addNotification({
    id: nextNotificationId(),
    level: "warn",
    message: "Failed to send shut down request.",
  });

const OnboardComputerCard: React.FunctionComponent = (_props) => {
  const dispatchNotifications = useContext(NotificationsDispatch);
  const onShutDownClick = useCallback(
    () =>
      handleShutDownClick().then(
        () => dispatchNotifications(addShutdownSuccessNotification()),
        () => dispatchNotifications(addShutdownFailureNotification())
      ),
    [dispatchNotifications]
  );

  return (
    <Card>
      <Card.Header>Onboard Computer</Card.Header>
      <Card.Body>
        <Card.Text>Control the onboard Raspberry Pi computer.</Card.Text>
        <div className="d-grid gap-2">
          <Button variant="danger" onClick={onShutDownClick}>
            Shut down
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OnboardComputerCard;
