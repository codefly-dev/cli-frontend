import { ErrorCard } from "@/components/error-card";
import type { Plugin, Service, ServiceInformation } from "@/types";
import { API_URL } from "@/utils/constants";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { option } from "fp-ts";
import useSWR from "swr";
import { EndpointList } from "./endpoint-list";
import { DeploymentList } from "./deployment-list";
import { Skeleton } from "@/components/skeleton";

export function PluginModal({
  base,
  open,
  onClose,
}: {
  base?: string;
  open: boolean;
  onClose: () => void;
}) {
  const { colorMode } = useColorMode();
  const {
    data: plugin,
    error,
    isLoading: loading,
  } = useSWR<Plugin>(`/plugin/${base}/usage`, (url) =>
    fetch(API_URL + url).then((res) => res.json())
  );

  if (error) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={error?.message} />
      </Container>
    );
  }

  return (
    <>
      <Modal isOpen={open} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />

        <ModalContent color={`text.${colorMode}`} bg={`bg.${colorMode}`}>
          <ModalHeader>
            {loading ? (
              <Stack>
                <Skeleton h="20px" w="50%" rounded="base" />
              </Stack>
            ) : (
              plugin?.usage.base
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={4}>
            <Text display="block" color={`textMuted.${colorMode}`} mb={1}>
              Uses
            </Text>
            {loading ? (
              <Stack>
                <Skeleton h="16px" w="70%" rounded="base" />
                <Skeleton h="16px" w="75%" rounded="base" />
                <Skeleton h="16px" w="60%" rounded="base" />
              </Stack>
            ) : plugin?.usage.uses.length === 0 ? (
              <Text fontSize="sm" color={`textMuted.${colorMode}`}>
                No uses found for this plugin
              </Text>
            ) : (
              <Flex flexDir="column" gap={1}>
                {plugin?.usage.uses.map((item) => (
                  <Text key={item.unique} fontWeight="normal">
                    {item.project}/{item.application}/{item.unique}
                  </Text>
                ))}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
