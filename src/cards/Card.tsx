import { Box, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  /** The title displayed at the top of the card. */
  title: string;
}>;

/** A "card" component for grouping related controls. */
const Card: React.FunctionComponent<CardProps> = ({ title, children }) => {
  const headerBg = useColorModeValue("gray.200", "gray.500");

  return (
    <Box
      maxW="xs"
      minW="xs"
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box bg={headerBg} p="2">
        <Text>{title}</Text>
      </Box>
      <Box p="6">
        <VStack spacing={4} align="stretch">
          {children}
        </VStack>
      </Box>
    </Box>
  );
};

export default Card;
