import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { CodeIcon, PlusIcon } from "@radix-ui/react-icons";
import { option } from "fp-ts";
import { pipe } from "fp-ts/function";
import Link from "next/link";
import pluralize from "pluralize";
import useSWR from "swr";

import { BreadcrumbLink } from "@/components/breadcrumb-link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/skeleton";
import type { Application, Project } from "@/types";
import { API_URL } from "@/utils/constants";
import { Logs } from "@/components/logs";

export function ProjectPage() {
  const { colorMode } = useColorMode();

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<{ project: Project }>("/project/information", (route) =>
    fetch(API_URL + route).then((res) => res.json())
  );

  if (error) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={error?.message} />
      </Container>
    );
  }

  const project = option.fromNullable(data?.project);

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
              {loading ? (
                <Skeleton h="36px" w="100%" maxW="250px" rounded="lg" />
              ) : (
                <Heading>
                  {option.isSome(project) ? project.value.name : "Project"}
                </Heading>
              )}
            </Flex>

            {/* {loading ? (
              <Skeleton h="36px" w="100%" maxW="90px" rounded="lg" />
            ) : (
              <Button size="sm" leftIcon={<PlusIcon />}>
                Add application
              </Button>
            )} */}
          </Flex>

          <TabList mt={5} gap={5}>
            <Tab px={0}>Applications</Tab>
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
                !loading && option.isNone(project) ? "1fr" : "repeat(3, 1fr)"
              }
              gap={6}
              w="100%"
            >
              {loading
                ? Array.from(Array(9).keys()).map((idx) => (
                    <GridItem key={idx}>
                      <ApplicationCard loading />
                    </GridItem>
                  ))
                : pipe(
                    project,
                    option.match(
                      () => <ErrorCard message="Unable to load project" />,
                      (p) =>
                        p.applications.length > 0 ? (
                          p.applications.map((application, idx) => (
                            <GridItem key={idx}>
                              <ApplicationCard
                                application={application}
                                projectId={p.unique}
                              />
                            </GridItem>
                          ))
                        ) : (
                          <Text>No applications found</Text>
                        )
                    )
                  )}
            </Grid>
          </TabPanel>
          <TabPanel p={0}>
            <Logs
              logs={Array(50).fill({
                at: "09:35:10.031",
                application: "some-app",
                service: "some-service",
                kind: ["UNKNOWN", "PLUGIN", "SERVICE"][
                  Math.floor(Math.random() * (2 - 0 + 1) + 0)
                ],
                message: "Previous build caches not available",
              })}
            />
          </TabPanel>
        </TabPanels>
      </Container>
    </Tabs>
  );
}

const ApplicationCard = ({
  application,
  projectId,
  loading,
}: {
  application?: Application;
  projectId?: string;
  loading?: boolean;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Card>
      {loading ? (
        <Stack>
          <Skeleton h="20px" w="30%" rounded="base" mb={1} />
          <Skeleton h="16px" w="40%" rounded="base" />

          <Skeleton h="16px" w="35%" rounded="base" mt={6} />
        </Stack>
      ) : application ? (
        <Link
          href={`/application?application=${application.unique}&project=${projectId}`}
        >
          <Box>
            <Heading as="p" fontSize="lg" fontWeight="semibold" mb={1}>
              {application.name}
            </Heading>
            <Text as="span" fontSize="sm" color={`textMuted.${colorMode}`}>
              {application.unique}
            </Text>

            <Flex
              mt={6}
              gap={2}
              color={`textMuted.${colorMode}`}
              alignItems="center"
            >
              <Icon as={CodeIcon} />
              <Text as="span" fontSize="sm">
                {pluralize("service", application.services.length, true)}
              </Text>
            </Flex>
          </Box>
        </Link>
      ) : null}
    </Card>
  );
};
