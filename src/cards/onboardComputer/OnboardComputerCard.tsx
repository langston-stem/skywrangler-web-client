import { useCallback } from "react";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import SwipeButton from "../SwipeButton";
import Card from "../Card";

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
    <Card title="Raspberry Pi">
      <SwipeButton
        label="Shut down"
        colorScheme="red"
        onClick={onShutDownClick}
        disabled={!props.isConnected}
      />
    </Card>
  );
};

export default OnboardComputerCard;
