"use client";

import { useColorMode } from "@chakra-ui/react";
import { Skeleton as ChakraSkeleton } from "@chakra-ui/react";

export function Skeleton(props) {
  const { colorMode } = useColorMode();
  return (
    <ChakraSkeleton opacity={colorMode === "light" ? 1 : 0.3} {...props} />
  );
}
