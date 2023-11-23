"use client";

import { Box, useColorMode } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function LayoutWrapper({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();
  return (
    <Box
      margin="auto"
      minHeight="100vh"
      backgroundColor={`bg.${colorMode}`}
      color={`text.${colorMode}`}
    >
      {children}
    </Box>
  );
}
