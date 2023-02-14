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
  Button,
  SliderMarkProps,
  SliderThumbProps,
  SliderTrackProps,
} from "@chakra-ui/react";
import { Text, VStack } from "@chakra-ui/react";
import {
  useAngle,
  useAzimuth,
  useDistance,
  useElevation,
  useLatitude,
  useReturnPointLatitude,
  useLength,
  useLongitude,
  useReturnPointLongitude,
  useSpeed,
} from "./hooks";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import Transect from "./Transect";

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

const sliderThumbProps: SliderThumbProps = {
  boxSize: 4,
  bg: langstonOrange,
};

const sliderTrackProps: SliderTrackProps = {
  boxSize: 2,
  bg: langstonBlue,
};

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
  const { ReturnPointLatitude, setReturnPointLatitude } =
    useReturnPointLatitude();
  const { longitude, setLongitude } = useLongitude();
  const { ReturnPointLongitude, setReturnPointLongitude } =
    useReturnPointLongitude();
  const { elevation, setElevation } = useElevation();
  const { azimuth, setAzimuth } = useAzimuth();
  const { length, setLength } = useLength();
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

  const handleLatitudeSign = useCallback(() => {
    setLatitude(-latitude);
  }, [latitude, setLatitude]);

  const handleLongitudeSign = useCallback(() => {
    setLongitude(-longitude);
  }, [longitude, setLongitude]);

  const handleElevationSign = useCallback(() => {
    setElevation(-elevation);
  }, [elevation, setElevation]);

  const transectSliderMarkProps = React.useMemo<Omit<SliderMarkProps, "value">>(
    () => ({
      textAlign: "center",
      bg: langstonBlue,
      color: "white",
      mt: "-10",
      ml: "-5",
      w: "11",
      paddingBlock: "2px",
      paddingInline: "5px",
      borderRadius: "5px",
    }),
    []
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
              columns={3}
              spacing={1}
              gridTemplateColumns="100px 35px auto"
              alignItems="center"
              justifyItems="start"
            >
              <Text>Latitude (°)</Text>
              <Button onClick={handleLatitudeSign} size="xs">
                +/-
              </Button>
              <NumberInput value={latitude} onChange={setLatitude} />
              <Text>Longitude (°)</Text>
              <Button onClick={handleLongitudeSign} size="xs">
                +/-
              </Button>
              <NumberInput value={longitude} onChange={setLongitude} />
              <Text>Elevation (m)</Text>
              <Button onClick={handleElevationSign} size="xs">
                +/-
              </Button>
              <NumberInput value={elevation} onChange={setElevation} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="center">
              Transect
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid
              columns={2}
              spacing={10}
              pb={8}
              gridTemplateColumns="45px auto"
              alignItems="center"
              justifyItems="start"
              marginTop="8px"
            >
              <Text>Azimuth (°)</Text>
              <Slider
                value={azimuth}
                onChange={setAzimuth}
                min={0}
                max={360}
                step={15}
                padding="2px"
              >
                <SliderMark value={0} {...labelStyles}>
                  0
                </SliderMark>
                <SliderMark value={90} {...labelStyles}>
                  90
                </SliderMark>
                <SliderMark value={180} {...labelStyles}>
                  180
                </SliderMark>
                <SliderMark value={270} {...labelStyles}>
                  270
                </SliderMark>
                <SliderMark value={360} {...labelStyles}>
                  360
                </SliderMark>
                <SliderMark value={azimuth} {...transectSliderMarkProps}>
                  {azimuth}
                </SliderMark>
                <SliderTrack {...sliderTrackProps} />
                <SliderThumb {...sliderThumbProps} />
              </Slider>

              <Text>Length (m)</Text>
              <Slider
                value={length}
                onChange={setLength}
                min={0}
                max={200}
                step={5}
              >
                <SliderMark value={0} {...labelStyles}>
                  0
                </SliderMark>
                <SliderMark value={50} {...labelStyles}>
                  50
                </SliderMark>
                <SliderMark value={100} {...labelStyles}>
                  100
                </SliderMark>
                <SliderMark value={150} {...labelStyles}>
                  150
                </SliderMark>
                <SliderMark value={200} {...labelStyles}>
                  200
                </SliderMark>
                <SliderMark value={length} {...transectSliderMarkProps}>
                  {length}
                </SliderMark>
                <SliderTrack {...sliderTrackProps} />
                <SliderThumb {...sliderThumbProps} />
              </Slider>
            </SimpleGrid>
            <Transect />
            <Text fontSize={"small"}>
              The <strong>transect</strong> refers to the line in which the
              drone will fly when its the closest to the livestock.
            </Text>
            <Text pb={2} fontSize={"small"}>
              The <strong>azimuth</strong> refers to the angle from north in
              which the UAV will fly, relative to the livestock.
            </Text>
            <Text pb={9} fontSize={"xs"}>
              <strong>Example:</strong> if the UAV is set to fly at an azimuth
              of 90°, the UAV will travel on the East (East = 90°) side of the
              livestock in a transect from <u>North to South</u>.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="center">
              Return Point
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid
              columns={3}
              spacing={1}
              gridTemplateColumns="100px 35px auto"
              alignItems="center"
              justifyItems="start"
            >
              <Text>Latitude (°)</Text>
              <Button onClick={handleLatitudeSign} size="xs">
                +/-
              </Button>
              <NumberInput
                value={ReturnPointLatitude}
                onChange={setReturnPointLatitude}
              />
              <Text>Longitude (°)</Text>
              <Button onClick={handleLongitudeSign} size="xs">
                +/-
              </Button>
              <NumberInput
                value={ReturnPointLongitude}
                onChange={setReturnPointLongitude}
              />
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
          <SliderTrack {...sliderTrackProps} />
          <SliderThumb {...sliderThumbProps} />
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
          <SliderTrack {...sliderTrackProps} />
          <SliderThumb {...sliderThumbProps} />
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
          <SliderTrack {...sliderTrackProps} />
          <SliderThumb {...sliderThumbProps} />
        </Slider>
      </VStack>
    </Card>
  );
};

export default Objective2Card;
