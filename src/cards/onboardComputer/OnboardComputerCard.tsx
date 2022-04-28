import { useCallback } from "react";
import { Box, Text, useToast, UseToastOptions, VStack } from "@chakra-ui/react";
import SwipeButton from "../SwipeButton";

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
    <Box
      maxW="sm"
      minW="sm"
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box bg="gray.200" p="2">
        <Text>Raspberry Pi</Text>
      </Box>
      <Box p="6">
        <VStack>
          <SwipeButton
            label="Shut down"
            colorScheme="red"
            onClick={onShutDownClick}
            disabled={!props.isConnected}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default OnboardComputerCard;
