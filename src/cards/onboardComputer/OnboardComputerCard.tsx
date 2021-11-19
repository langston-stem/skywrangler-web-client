import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import NotificationsDispatch from "../../notifications/NotificationsDispatch";
import { nextId as nextNotificationId } from "../../notifications/notification";
import { add as addNotification } from "../../notifications/actions";

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

const OnboardComputerCard: React.FunctionComponent = (props) => {
  const dispatchNotifications = useContext(NotificationsDispatch);

  return (
    <Card>
      <Card.Header>Onboard Computer</Card.Header>
      <Card.Body>
        <Card.Text>Control the onboard Raspberry Pi computer.</Card.Text>
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
  );
};

export default OnboardComputerCard;
