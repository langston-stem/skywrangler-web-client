import { useCallback, useEffect, useState } from "react";
import { Text, useToast, UseToastOptions } from "@chakra-ui/react";
import ReconnectingEventSource from "reconnecting-eventsource";
import { fromEvent, Unsubscribable } from "rxjs";
import SwipeButton from "../SwipeButton";
import Card from "../Card";
import { map, distinctUntilChanged } from "rxjs";
import {
  useAngle,
  useDistance,
  useElevation,
  useLatitude,
  useLongitude,
  useSpeed,
} from "../objective2/hooks";

const handleFlyMissionClick = (
  latitude: number,
  longitude: number,
  elevation: number,
  speed: number,
  distance: number,
  angle: number
) =>
  new Promise<void>(async (resolve, reject) => {
    try {
      const data = {
        origin: {
          latitude,
          longitude,
          elevation,
        },
        parameters: {
          speed,
          distance,
          angle,
        },
      };
      const response = await fetch("/api/drone/fly_mission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

/**
 * Subscribes to an event from an EventSource.
 *
 * Duplicate events are ignored.
 *
 * @param eventSource The event source.
 * @param eventName The name of the event.
 * @param callback The callback called when the event occurs.
 * @returns An unsubscribe callback.
 */
function subscribeStatus<T>(
  eventSource: ReconnectingEventSource,
  eventName: string,
  callback: (data: T) => void
): Unsubscribable {
  return fromEvent<MessageEvent<string>>(eventSource, eventName)
    .pipe(
      map((e) => e.data),
      // distict test has to be performed on string, if we parse JSON first,
      // objects will always be new objects
      distinctUntilChanged(),
      map((d) => JSON.parse(d))
    )
    .subscribe({ next: callback });
}

/** Prefix for console log messages */
const DRONE_STATUS = "drone status:";

const DroneCard: React.FunctionComponent = () => {
  const toast = useToast({ position: "top", isClosable: true });
  const [isConnectionOk, setIsConnectionOk] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isHealthAllOk, setIsHealthAllOk] = useState(false);
  const [, setIsArmable] = useState(false);
  const [isHomePositionOk, setIsHomePositionOk] = useState(false);
  const [isLocalPositionOk, setIsLocalPositionOk] = useState(false);
  const [isInAir, setIsInAir] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isMissionInProgress, setIsMissionInProgress] = useState(false);
  const [isReturnInProgress, setIsReturnInProgress] = useState(false);

  // the state for these defaults to true to avoid spurious messages on page load
  const [isAccelCalOk, setIsAccelCalOk] = useState(true);
  const [isGpsOk, setIsGpsOk] = useState(true);
  const [isGyroCalOk, setIsGyroCalOk] = useState(true);
  const [isMagCalOk, setIsMagCalOk] = useState(true);

  useEffect(() => {
    const eventSource = new ReconnectingEventSource("/api/drone/status");
    const subscriptions = new Array<Unsubscribable>();

    subscriptions.push(
      fromEvent(eventSource, "open").subscribe({
        next: () => setIsConnectionOk(true),
      })
    );

    subscriptions.push(
      fromEvent(eventSource, "error").subscribe({
        next: () => setIsConnectionOk(false),
      })
    );

    subscriptions.push(
      subscribeStatus<boolean>(eventSource, "isConnected", (data) => {
        console.debug(DRONE_STATUS, "isConnected:", data);
        setIsConnected(data);
      })
    );

    subscriptions.push(
      subscribeStatus<boolean>(eventSource, "isHealthAllOk", (data) => {
        console.debug(DRONE_STATUS, "isHealthAllOk:", data);
        setIsHealthAllOk(data);
      })
    );

    subscriptions.push(
      subscribeStatus<{
        isAccelerometerCalibrationOk: boolean;
        isArmable: boolean;
        isGlobalPositionOk: boolean;
        isGyrometerCalibrationOk: boolean;
        isHomePositionOk: boolean;
        isLocalPositionOk: boolean;
        isMagnetometerCalibrationOk: boolean;
      }>(eventSource, "health", (data) => {
        console.debug(DRONE_STATUS, "health:", data);

        setIsAccelCalOk(data.isAccelerometerCalibrationOk);
        setIsArmable(data.isArmable);
        setIsGpsOk(data.isGlobalPositionOk);
        setIsGyroCalOk(data.isGyrometerCalibrationOk);
        setIsHomePositionOk(data.isHomePositionOk);
        setIsLocalPositionOk(data.isLocalPositionOk);
        setIsMagCalOk(data.isMagnetometerCalibrationOk);
      })
    );

    subscriptions.push(
      subscribeStatus<boolean>(eventSource, "isInAir", (data) => {
        console.debug(DRONE_STATUS, "isInAir:", data);
        setIsInAir(data);
      })
    );

    subscriptions.push(
      subscribeStatus<string>(eventSource, "statusText", (data) => {
        console.debug(DRONE_STATUS, "statusText:", data);
        setStatusText(data);
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

  const { latitude } = useLatitude();
  const { elevation } = useElevation();
  const { speed } = useSpeed();
  const { distance } = useDistance();
  const { angle } = useAngle();
  const { longitude } = useLongitude();

  const handleLaunchButtonClick = useCallback(() => {
    setIsMissionInProgress(true);

    handleFlyMissionClick(
      latitude,
      longitude,
      elevation,
      speed,
      distance,
      angle
    )
      .then(
        () => toast(missionSuccessNotification),
        () => toast(missionFailureNotification)
      )
      .finally(() => setIsMissionInProgress(false));
  }, [
    setIsMissionInProgress,
    toast,
    latitude,
    longitude,
    elevation,
    speed,
    distance,
    angle,
  ]);

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
    <Card title="Drone">
      {isConnected && statusText && <Text>{statusText}</Text>}
      {!isConnected && <Text>Disconnected.</Text>}
      {isConnected && (!isHomePositionOk || !isLocalPositionOk) && (
        <Text>Waiting for GPS position OK.</Text>
      )}
      {isConnected && !isGpsOk && <Text>Check GPS.</Text>}
      {isConnected && !isGyroCalOk && <Text>Check gyro.</Text>}
      {isConnected && !isAccelCalOk && <Text>Check accelerometer.</Text>}
      {isConnected && !isMagCalOk && <Text>Check compass.</Text>}
      {isInAir ? (
        <SwipeButton
          label="Return"
          colorScheme="yellow"
          disabled={!isConnectionOk || !isConnected || isReturnInProgress}
          onClick={handleReturnButtonClick}
        />
      ) : (
        <SwipeButton
          label="Launch"
          colorScheme="green"
          disabled={
            !isConnectionOk ||
            !isConnected ||
            !isHealthAllOk ||
            isMissionInProgress
          }
          onClick={handleLaunchButtonClick}
        />
      )}
    </Card>
  );
};

export default DroneCard;
