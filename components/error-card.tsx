import { Flex, Icon, useColorMode } from "@chakra-ui/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export function ErrorCard({ message }: { message?: string }) {
  const { colorMode } = useColorMode();
  return (
    <Flex
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      borderRadius="xl"
      border="1px solid"
      borderColor={`border.${colorMode}`}
      bg={`bgLayer.${colorMode}`}
      boxShadow="sm"
      padding={4}
      gap={2}
    >
      <Icon as={ExclamationTriangleIcon} boxSize={10} color="orange.700" />
      Error: {message ?? "An unexpected error has occured"}
    </Flex>
  );
}
