import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
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
import { option } from "fp-ts";
import { pipe } from "fp-ts/function";
import useSWR from "swr";

import { Card } from "@/components/card";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/skeleton";
import type { Plugin } from "@/types";
import { API_URL } from "@/utils/constants";
import Link from "next/link";

export function PluginPage({
  publisher,
  name,
}: {
  publisher: string;
  name: string;
}) {
  const { colorMode } = useColorMode();
  const url = `/plugin/${publisher}/${name}/usage`;
  const {
    data,
    error,
    isLoading: loading,
  } = useSWR<Plugin>(url, () => fetch(API_URL + url).then((res) => res.json()));

  if (error) {
    return (
      <Container maxW="5xl" my={5} h="60vh">
        <ErrorCard message={error?.message} />
      </Container>
    );
  }

  const plugin = option.fromNullable(data);

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
                  {option.isSome(plugin) ? plugin.value.usage.base : "Plugin"}
                </Heading>
              )}
            </Flex>
          </Flex>

          <TabList mt={5} gap={5}>
            <Tab px={0}>Services</Tab>
          </TabList>
          <TabIndicator mt="-2px" height="2px" bg={`text.${colorMode}`} />
        </Container>
      </Box>
      <Container maxW="5xl" py="10">
        <TabPanels>
          <TabPanel p={0}>
            <Grid
              templateColumns={
                !loading && option.isNone(plugin) ? "1fr" : "repeat(3, 1fr)"
              }
              gap={6}
              w="100%"
            >
              {loading
                ? Array.from(Array(9).keys()).map((idx) => (
                    <GridItem key={idx}>
                      <PluginUsageCard loading />
                    </GridItem>
                  ))
                : pipe(
                    plugin,
                    option.match(
                      () => (
                        <ErrorCard message="Unable to load plugin services" />
                      ),
                      (p) =>
                        p.usage.uses.length > 0 ? (
                          p.usage.uses.map((usage, idx) => (
                            <GridItem key={idx}>
                              <PluginUsageCard
                                usage={usage}
                                loading={loading}
                              />
                            </GridItem>
                          ))
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
}

const PluginUsageCard = ({
  usage,
  loading,
}: {
  usage?: Plugin["usage"]["uses"][number];
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
      ) : usage ? (
        <>
          <Box>
            <Heading as="p" fontSize="lg" fontWeight="semibold" mb={1}>
              {usage.unique}
            </Heading>

            <Flex flexDir="column" gap={1} mt={2}>
              <Flex gap={1}>
                <Text color={`textMuted.${colorMode}`}>Version</Text>
                <Text>{usage.version}</Text>
              </Flex>

              <Flex gap={1}>
                <Text color={`textMuted.${colorMode}`}>Project:</Text>
                <Link href={`/project?project=${usage.project}`}>
                  <Text cursor="pointer" textDecor="underline">
                    {usage.project}
                  </Text>
                </Link>
              </Flex>

              <Flex gap={1}>
                <Text color={`textMuted.${colorMode}`}>Application:</Text>
                <Link
                  href={`/application?project=${usage.project}&application=${usage.application}`}
                >
                  <Text cursor="pointer" textDecor="underline">
                    {usage.application}
                  </Text>
                </Link>
              </Flex>
            </Flex>
          </Box>
        </>
      ) : null}
    </Card>
  );
};
