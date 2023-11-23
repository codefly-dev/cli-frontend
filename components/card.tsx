import { Box, type BoxProps, useColorMode } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function Card({ children, ...props }: BoxProps) {
  const { colorMode } = useColorMode();
  return (
    <Box
      w="100%"
      h="100%"
      borderRadius="xl"
      border="1px solid"
      borderColor={`border.${colorMode}`}
      bg={`bgLayer.${colorMode}`}
      // _hover={{ opacity: 0.8 }}
      boxShadow="sm"
      padding={4}
      {...props}
    >
      {children}
    </Box>
  );
}
