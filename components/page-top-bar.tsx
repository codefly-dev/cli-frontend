"use client";

import { dm_sans } from "@/app/fonts";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  List,
  ListItem,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function PageTopBar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      width="100%"
      padding="5"
      paddingTop={3}
      paddingBottom={3}
      backgroundColor={`bgLayer.${colorMode}`}
      borderBottom="1px solid"
      borderBottomColor={`border.${colorMode}`}
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex alignItems="center" gap={10}>
        <Flex h="60px" alignItems="center">
          <Link href="/">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="#5C7BE9"
              className={dm_sans.className}
            >
              codefly.ai
            </Text>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <Image src="/logo_rect.png" alt="Codefly logo" w="100%" h="100%" /> */}
          </Link>
        </Flex>

        <List display="flex" flexDir="row" gap={4}>
          <ListItem>
            <Link href="/">Workspace</Link>
          </ListItem>
          <ListItem display="flex" alignItems="center" gap={2}>
            <a href="#">Marketplace</a> <Icon as={ExternalLinkIcon} />
          </ListItem>
        </List>
      </Flex>

      <IconButton
        aria-label="Toggle theme"
        variant="ghost"
        title="Toggle theme"
        onClick={toggleColorMode}
      >
        <Icon as={colorMode === "light" ? SunIcon : MoonIcon} boxSize={18} />
      </IconButton>
    </Flex>
  );
}
