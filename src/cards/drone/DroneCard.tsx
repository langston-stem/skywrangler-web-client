import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  useToast,
  UseToastOptions,
  VStack,
} from "@chakra-ui/react";
import ReconnectingEventSource from "reconnecting-eventsource";
import { fromEvent, Unsubscribable } from "rxjs";

const handleFlyMissionClick = () =>
  new Promise<void>(async (resolve, reject) => {
    try {
      const response = await fetch("/api/drone/fly_mission", {
        method: "POST",
      });
      if (response.ok) {
        resolve();
      } else {
        console.error(
          `handleFlyMissionClick response error: (${response.status}) ${response.statusText}`
        );
        reject(response);
      }
    } catch (err) {
      console.error(`error in handleFlyMissionClick: ${err}`);
      reject(err);
    }
  });

const sendReturnRequest = () =>
  new Promise<void>(async (resolve, reject) => {
    try {
      const response = await fetch("/api/drone/return", {
        method: "POST",
      });
      if (response.ok) {
        resolve();
      } else {
        console.error(
          `sendReturnRequest response error: (${response.status}) ${response.statusText}`
        );
        reject(response);
      }
    } catch (err) {
      console.error(`error in sendReturnRequest: ${err}`);
      reject(err);
    }
  });

const missionSuccessNotification: UseToastOptions = {
  status: "info",
  description: "Mission complete.",
};

const missionFailureNotification: UseToastOptions = {
  status: "error",
  description: "Mission failed.",
};

const returnSuccessNotification: UseToastOptions = {
  status: "info",
  description: "Return requested.",
};

const returnFailureNotification: UseToastOptions = {
  status: "error",
  description: "Return failed.",
};

const DroneCard: React.VoidFunctionComponent = () => {
  const toast = useToast({ position: "top", isClosable: true });
  const [isConnectionOk, setIsConnectionOk] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isHealthAllOk, setIsHealthAllOk] = useState(false);
  const [isAccelCalOk, setIsAccelCalOk] = useState(false);
  const [, setIsArmable] = useState(false);
  const [isGpsOk, setIsGpsOk] = useState(false);
  const [isGyroCalOk, setIsGyroCalOk] = useState(false);
  const [, setIsHomePositionOk] = useState(false);
  const [, setIsLocalPositionOk] = useState(false);
  const [isMagCalOk, setIsMagCalOk] = useState(false);
  const [isInAir, setIsInAir] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isMissionInProgress, setIsMissionInProgress] = useState(false);
  const [isReturnInProgress, setIsReturnInProgress] = useState(false);

  useEffect(() => {
    const eventSource = new ReconnectingEventSource("/api/drone/status");
    const subscriptions = new Array<Unsubscribable>();

    subscriptions.push(
      fromEvent(eventSource, "open").subscribe({
        next: (ev) => setIsConnectionOk(true),
      })
    );

    subscriptions.push(
      fromEvent(eventSource, "error").subscribe({
        next: (ev) => setIsConnectionOk(false),
      })
    );

    subscriptions.push(
      fromEvent<MessageEvent<string>>(eventSource, "message").subscribe({
        next: (ev) => {
          console.debug(ev);
          const data = JSON.parse(ev.data);

          switch (ev.lastEventId) {
            case "is_connected":
              setIsConnected(data);
              break;
            case "is_health_all_ok":
              setIsHealthAllOk(data);
              break;
            case "health":
              setIsAccelCalOk(data.is_accelerometer_calibration_ok);
              setIsArmable(data.is_armable);
              setIsGpsOk(data.is_global_position_ok);
              setIsGyroCalOk(data.is_gyrometer_calibration_ok);
              setIsHomePositionOk(data.is_home_position_ok);
              setIsLocalPositionOk(data.is_local_position_ok);
              setIsMagCalOk(data.is_magnetometer_calibration_ok);
              break;
            case "is_in_air":
              setIsInAir(data);
              break;
            case "status_text":
              setStatusText(data);
              break;
          }
        },
      })
    );
    return () => {
      subscriptions.forEach((s) => s.unsubscribe());
      eventSource.close();
    };
  }, [
    setIsConnectionOk,
    setIsConnected,
    setIsHealthAllOk,
    setIsAccelCalOk,
    setIsArmable,
    setIsGpsOk,
    setIsGyroCalOk,
    setIsHomePositionOk,
    setIsLocalPositionOk,
    setIsMagCalOk,
    setIsInAir,
    setStatusText,
  ]);

  const handleLaunchButtonClick = useCallback(() => {
    setIsMissionInProgress(true);

    handleFlyMissionClick()
      .then(
        () => toast(missionSuccessNotification),
        () => toast(missionFailureNotification)
      )
      .finally(() => setIsMissionInProgress(false));
  }, [setIsMissionInProgress, toast]);

  const handleReturnButtonClick = useCallback(() => {
    setIsReturnInProgress(true);

    sendReturnRequest()
      .then(
        () => toast(returnSuccessNotification),
        () => toast(returnFailureNotification)
      )
      .finally(() => setIsReturnInProgress(false));
  }, [setIsReturnInProgress, toast]);

  return (
    <Box
      maxW="sm"
      minW="sm"
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box bg="gray.200" p="2">
        <Text>Drone</Text>
      </Box>
      <Box p="6">
        <VStack>
          {statusText && <Text>{statusText}</Text>}
          {!isConnected && <Text>Disconnected.</Text>}
          {isConnected && !isGpsOk && <Text>Check GPS.</Text>}
          {isConnected && !isGyroCalOk && <Text>Check gyro.</Text>}
          {isConnected && !isAccelCalOk && <Text>Check accelerometer.</Text>}
          {isConnected && !isMagCalOk && <Text>Check compass.</Text>}
          {!isInAir && (
            <Button
              isFullWidth={true}
              colorScheme="green"
              onClick={handleLaunchButtonClick}
              disabled={
                !isConnectionOk ||
                !isConnected ||
                !isHealthAllOk ||
                isMissionInProgress
              }
            >
              Launch
            </Button>
          )}
          {isInAir && (
            <Button
              isFullWidth={true}
              colorScheme="yellow"
              onClick={handleReturnButtonClick}
              disabled={!isConnectionOk || !isConnected || isReturnInProgress}
            >
              Return
            </Button>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default DroneCard;
