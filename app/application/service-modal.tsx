import {
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
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import useSWR from "swr";

import { ErrorCard } from "@/components/error-card";
import type { Service, ServiceInformation } from "@/types";
import { API_URL } from "@/utils/constants";
import { DeploymentList } from "./deployment-list";
import { EndpointList } from "./endpoint-list";
import { PluginModal } from "./plugin-modal";
import Link from "next/link";

export function ServiceModal({
  service,
  open,
  onClose,
  projectId,
  applicationId,
}: {
  service: Service | null;
  open: boolean;
  onClose: () => void;
  projectId: string;
  applicationId: string;
}) {
  const [pluginShown, setPluginShown] = useState(false);
  const { colorMode } = useColorMode();
  const {
    data: serviceInformation,
    error,
    isLoading: loading,
  } = useSWR<ServiceInformation>(
    `/project/${projectId}/application/${applicationId}/service/${service?.unique}/information`,
    (url) => fetch(API_URL + url).then((res) => res.json())
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
        {!!service && (
          <ModalContent color={`text.${colorMode}`} bg={`bg.${colorMode}`}>
            <PluginModal
              base={service.base.split(":")[0]}
              open={pluginShown}
              onClose={() => setPluginShown(false)}
            />

            <ModalHeader>{service.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody mb={4}>
              <Flex flexDir="column" gap={4}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Text color={`textMuted.${colorMode}`}>Base</Text>

                    <Link
                      href={`/plugin?publisher=${
                        service.base.split(":")[0].split("/")[0]
                      }&name=${service.base.split(":")[0].split("/")[1]}`}
                    >
                      <Text
                        cursor="pointer"
                        textDecor="underline"
                        // onClick={() => setPluginShown(true)}
                      >
                        {service.base}
                      </Text>
                    </Link>
                  </GridItem>

                  <GridItem>
                    <Text color={`textMuted.${colorMode}`}>Version</Text>
                    <Text>{service.version || "N/A"}</Text>
                  </GridItem>
                </Grid>

                <EndpointList service={service} />

                <DeploymentList
                  deployments={serviceInformation?.deployments ?? []}
                  loading={loading}
                />
              </Flex>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
