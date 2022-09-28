import React, { useEffect, useState } from "react";
import OnboardComputerCard from "./cards/onboardComputer/OnboardComputerCard";
import { fromEvent, Unsubscribable } from "rxjs";
import ReconnectingEventSource from "reconnecting-eventsource";
import {
  ChakraProvider,
  theme,
  Box,
  Grid,
  VStack,
  Heading,
} from "@chakra-ui/react";
import DroneCard from "./cards/drone/DroneCard";
import Objective2Card from "./cards/objective2/Objective2Card";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

function App() {
  const [connectionOk, setConnectionOk] = useState(false);

  useEffect(() => {
    const eventSource = new ReconnectingEventSource("/api/status");
    const subscriptions = new Array<Unsubscribable>();
    subscriptions.push(
      fromEvent(eventSource, "open").subscribe({
        next: (ev) => setConnectionOk(true),
      })
    );
    subscriptions.push(
      fromEvent(eventSource, "error").subscribe({
        next: (ev) => setConnectionOk(false),
      })
    );
    subscriptions.push(
      fromEvent(eventSource, "heartbeat").subscribe({
        next: (ev) => console.debug(ev),
      })
    );
    return () => {
      subscriptions.forEach((s) => s.unsubscribe());
      eventSource.close();
    };
  }, [setConnectionOk]);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Heading>Sky Wrangler UAV</Heading>
            <Objective2Card />
            <DroneCard />
            <OnboardComputerCard isConnected={connectionOk} />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
