import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useCallback } from "react";
import { useToast, UseToastOptions } from "@chakra-ui/react";

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

const shutdownSuccessNotification: UseToastOptions = {
  status: "info",
  description:
    "Shutting down computer - please wait for green light to stop flashing before removing power.",
};

const shutdownFailureNotification: UseToastOptions = {
  status: "warning",
  description: "Failed to send shut down request.",
  duration: null,
};

type Props = {
  isConnected: boolean;
};

const OnboardComputerCard: React.FunctionComponent<Props> = (props) => {
  const toast = useToast({ position: "top", isClosable: true });

  const onShutDownClick = useCallback(
    () =>
      handleShutDownClick().then(
        () => toast(shutdownSuccessNotification),
        () => toast(shutdownFailureNotification)
      ),
    [toast]
  );

  return (
    <Card>
      <Card.Header>Onboard Computer</Card.Header>
      <Card.Body>
        <Card.Text>Control the onboard Raspberry Pi computer.</Card.Text>
        <div className="d-grid gap-2">
          <Button
            variant="danger"
            onClick={onShutDownClick}
            disabled={!props.isConnected}
          >
            Shut down
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OnboardComputerCard;
