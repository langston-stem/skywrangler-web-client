import { Box, Text, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  /** The title displayed at the top of the card. */
  title: string;
}>;

/** A "card" component for grouping related controls. */
const Card: React.FunctionComponent<CardProps> = ({ title, children }) => {
  return (
    <Box
      maxW="xs"
      minW="xs"
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box bg="gray.200" p="2">
        <Text>{title}</Text>
      </Box>
      <Box p="6">
        <VStack>{children}</VStack>
      </Box>
    </Box>
  );
};

export default Card;
