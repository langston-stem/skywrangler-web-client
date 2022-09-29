import Card from "../Card";
import * as React from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { Text, VStack } from "@chakra-ui/react";
import { useAngle, useDistance, useSpeed } from "./hooks";
import { useCallback } from "react";

function fromDistance(distance: number): number {
  if (distance === 3) {
    return 0;
  }
  if (distance === 7) {
    return 1;
  }
  if (distance === 15) {
    return 2;
  }
  if (distance === 30) {
    return 3;
  }
  return 3;
}

function toDistance(value: number): number {
  if (value === 0) {
    return 3;
  }
  if (value === 1) {
    return 7;
  }
  if (value === 2) {
    return 15;
  }
  if (value === 3) {
    return 30;
  }
  return 30;
}
const Objective2Card: React.FunctionComponent = () => {
  const { angle, setAngle } = useAngle();
  const { distance, setDistance } = useDistance();
  const { speed, setSpeed } = useSpeed();

  const distanceValue = fromDistance(distance);
  const setDistanceValue = useCallback(
    (value: number) => {
      setDistance(toDistance(value));
    },
    [setDistance]
  );

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  return (
    <Card title="Objective 2">
      <VStack paddingBottom={4}>
        <Text fontSize={"small"} color="black">
          Angle:
        </Text>
        <Slider
          value={angle}
          onChange={setAngle}
          min={30}
          max={90}
          step={30}
        >
          <SliderMark value={30} {...labelStyles}>
            30°
          </SliderMark>
          <SliderMark value={60} {...labelStyles}>
            60°
          </SliderMark>
          <SliderMark value={90} {...labelStyles}>
            90°
          </SliderMark>
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="blue.500" />
          </SliderTrack>
          <SliderThumb boxSize={3} />
        </Slider>
      </VStack>
      <VStack paddingBottom={4}>
        <Text fontSize={"small"} color="black">
          Distance:
        </Text>
        <Slider
          value={distanceValue}
          onChange={setDistanceValue}
          min={0}
          max={3}
          step={1}
        >
          <SliderMark value={0} {...labelStyles}>
            3m
          </SliderMark>
          <SliderMark value={1} {...labelStyles}>
            7m
          </SliderMark>
          <SliderMark value={2} {...labelStyles}>
            15m
          </SliderMark>
          <SliderMark value={3} {...labelStyles}>
            30m
          </SliderMark>
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="blue.500" />
          </SliderTrack>
          <SliderThumb boxSize={3} />
        </Slider>
      </VStack>
      <VStack paddingBottom={4}>
        <Text fontSize={"small"} color="black">
          Speed:
        </Text>
        <Slider
          value={speed}
          onChange={setSpeed}
          min={2}
          max={8}
          step={3}
        >
          <SliderMark value={2} {...labelStyles}>
            2m/s
          </SliderMark>
          <SliderMark value={5} {...labelStyles}>
            5m/s
          </SliderMark>
          <SliderMark value={8} {...labelStyles}>
            8m/s
          </SliderMark>
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="blue.500" />
          </SliderTrack>
          <SliderThumb boxSize={3} />
        </Slider>
      </VStack>
    </Card>
  );
};

export default Objective2Card;
