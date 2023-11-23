import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import useSWR from "swr";

import { BreadcrumbLink } from "@/components/breadcrumb-link";
import { Button } from "@/components/button";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/skeleton";
import type { Application, Service } from "@/types";
import { option } from "fp-ts";
import { pipe } from "fp-ts/function";
import { ServiceCard } from "./service-card";
import { API_URL } from "@/utils/constants";
import { ServiceModal } from "./service-modal";

export function ApplicationPage({
  applicationId,
  projectId,
}: {
  applicationId: string;
  projectId: string;
}) {
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<{ application: Application }>(
    [`/application/${applicationId}/information`, lastSynced],
    ([url]) => fetch(API_URL + url).then((res) => res.json())
  );

  if (error) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={error?.message} />
      </Container>
    );
  }

  const application = option.fromNullable(data?.application);

  return (
    <AppServices
      application={application}
      projectId={projectId}
      loading={loading}
      onSync={() => setLastSynced(new Date())}
    />
  );
}

const AppServices = ({
  application,
  projectId,
  loading,
  onSync,
}: {
  application: option.Option<Application>;
  projectId: string;
  loading: boolean;
  onSync: () => void;
}) => {
  const { colorMode } = useColorMode();
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <Tabs variant="unstyled">
      <Box
        bg={`bgLayer.${colorMode}`}
        borderBottom="1px solid"
        borderColor={`border.${colorMode}`}
      >
        <Container maxW="5xl" pt={10}>
          <Flex w="100%" justifyContent="space-between" alignItems="flex-end">
            <Flex flexDir="column" gap={2} w="100%">
              <BreadcrumbLink href={`/`}>Applications</BreadcrumbLink>
              {loading ? (
                <Skeleton h="36px" w="100%" maxW="250px" rounded="lg" />
              ) : (
                <Heading>
                  {option.isSome(application)
                    ? application.value.name
                    : "Application"}
                </Heading>
              )}
            </Flex>

            {loading ? (
              <Skeleton h="36px" w="100%" maxW="90px" rounded="lg" />
            ) : (
              <Button size="sm" onClick={onSync} isDisabled={loading}>
                {loading ? <Spinner size="sm" /> : "Sync"}
              </Button>
            )}
          </Flex>

          <TabList mt={5} gap={5}>
            <Tab px={0}>Services</Tab>
            <Tab px={0}>Logs</Tab>
          </TabList>
          <TabIndicator mt="-2px" height="2px" bg={`text.${colorMode}`} />
        </Container>
      </Box>
      <Container maxW="5xl" py="10">
        <TabPanels>
          <TabPanel p={0}>
            <Grid
              templateColumns={
                !loading && option.isNone(application)
                  ? "1fr"
                  : "repeat(3, 1fr)"
              }
              gap={6}
              w="100%"
            >
              {loading
                ? Array.from(Array(9).keys()).map((idx) => (
                    <GridItem key={idx}>
                      <ServiceCard loading />
                    </GridItem>
                  ))
                : pipe(
                    application,
                    option.match(
                      () => <ErrorCard message="Unable to load application" />,
                      (a) =>
                        a.services.length > 0 ? (
                          <>
                            <ServiceModal
                              service={activeService}
                              open={!!activeService}
                              onClose={() => setActiveService(null)}
                              projectId={projectId}
                              applicationId={a.unique}
                            />
                            {a.services.map((service, idx) => (
                              <GridItem
                                key={idx}
                                cursor="pointer"
                                onClick={() => setActiveService(service)}
                              >
                                <ServiceCard service={service} />
                              </GridItem>
                            ))}
                          </>
                        ) : (
                          <Text>No services found</Text>
                        )
                    )
                  )}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Container>
    </Tabs>
  );
};
