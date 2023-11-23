"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { gray } from "@radix-ui/colors";
import type { PropsWithChildren } from "react";

import { WebsocketProvider } from "@/context/websocket";

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
        fontSize: "14px",
        fontFamily: "var(--font-inter)",
      },
    },
  },
  fonts: {
    heading: "var(--font-inter)",
    body: "var(--font-inter)",
  },
  colors: {
    gray: {
      100: gray.gray2,
      200: gray.gray3,
      300: gray.gray5,
      400: gray.gray7,
      500: gray.gray8,
      600: gray.gray9,
      700: gray.gray10,
      800: gray.gray11,
      900: gray.gray12,
    },
    border: {
      light: "var(--chakra-colors-blackAlpha-200)",
      dark: "var(--chakra-colors-whiteAlpha-50)",
    },
    bg: {
      light: "var(--chakra-colors-gray-100)",
      dark: "var(--chakra-colors-blackAlpha-900)",
    },
    bgLayer: {
      light: "white",
      dark: "var(--chakra-colors-whiteAlpha-50)",
    },
    text: {
      light: "black",
      dark: "white",
    },
    textMuted: {
      light: "var(--chakra-colors-gray-800)",
      dark: "var(--chakra-colors-gray-600)",
    },
  },
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
