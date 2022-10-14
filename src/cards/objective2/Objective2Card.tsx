import Card from "../Card";
import * as React from "react";
import {
  Slider,
  SliderTrack,
  SliderThumb,
  SliderMark,
  Input,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { Text, VStack } from "@chakra-ui/react";
import {
  useAngle,
  useDistance,
  useElevation,
  useLatitude,
  useLongitude,
  useSpeed,
} from "./hooks";
import { useCallback, useEffect } from "react";
import { useState } from "react";

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

const labelStyles = {
  mt: "2",
  ml: "-2.5",
  fontSize: "sm",
};

const langstonBlue = "rgb(27,54,104)";
const langstonOrange = "rgb(242,104,42)";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
};

const NumberInput: React.FunctionComponent<NumberInputProps> = ({
  value,
  onChange,
}) => {
  const [stringValue, setStringValue] = useState(String(value));
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setStringValue(String(value));
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStringValue(event.target.value);

      const newValue = Number(event.target.value);

      if (isNaN(newValue)) {
        setIsValid(false);
      } else {
        setIsValid(true);
        onChange(newValue);
      }
    },
    [onChange]
  );

  return (
    <Input
      inputMode="decimal"
      isInvalid={!isValid}
      value={stringValue}
      onChange={handleChange}
    />
  );
};

const Objective2Card: React.FunctionComponent = () => {
  const { latitude, setLatitude } = useLatitude();
  const { longitude, setLongitude } = useLongitude();
  const { elevation, setElevation } = useElevation();
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

  return (
    <Card title="Objective 2">
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="center">
              Origin
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid
              columns={2}
              spacing={1}
              gridTemplateColumns="90px auto"
              alignItems="center"
              justifyItems="start"
            >
              <Text>Latitude</Text>
              <NumberInput value={latitude} onChange={setLatitude} />

              <Text>Longitude</Text>
              <NumberInput value={longitude} onChange={setLongitude} />

              <Text>Elevation</Text>
              <NumberInput value={elevation} onChange={setElevation} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <VStack paddingBottom={4}>
        <Text fontSize={"small"}>Angle</Text>
        <Slider value={angle} onChange={setAngle} min={30} max={90} step={30}>
          <SliderMark value={30} {...labelStyles}>
            30°
          </SliderMark>
          <SliderMark value={60} {...labelStyles}>
            60°
          </SliderMark>
          <SliderMark value={90} {...labelStyles}>
            90°
          </SliderMark>
          <SliderTrack boxSize={2} bg={langstonBlue} />
          <SliderThumb boxSize={4} bg={langstonOrange} />
        </Slider>
      </VStack>
      <VStack paddingBottom={4}>
        <Text fontSize={"small"}> Distance </Text>
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
          <SliderTrack boxSize={2} bg={langstonBlue} />
          <SliderThumb boxSize={4} bg={langstonOrange} />
        </Slider>
      </VStack>
      <VStack paddingBottom={4}>
        <Text fontSize={"small"}>Speed</Text>
        <Slider value={speed} onChange={setSpeed} min={2} max={8} step={3}>
          <SliderMark value={2} {...labelStyles}>
            2m/s
          </SliderMark>
          <SliderMark value={5} {...labelStyles}>
            5m/s
          </SliderMark>
          <SliderMark value={8} {...labelStyles}>
            8m/s
          </SliderMark>
          <SliderTrack boxSize={2} bg={langstonBlue} />
          <SliderThumb boxSize={4} bg={langstonOrange} />
        </Slider>
      </VStack>
    </Card>
  );
};

export default Objective2Card;
