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
import useSWR from "swr";

import { Card } from "@/components/card";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/skeleton";
import { API_URL } from "@/utils/constants";
import Link from "next/link";
import { TabContent } from "@/components/tabs";

export function AgentPage({
  version,
  name,
}: {
  version: string;
  name: string;
}) {
  const {
    data: agent,
    error,
    isLoading: loading,
  } = useSWR(`overall/agent/${name}:${version}/information`, (route) =>
    fetch(API_URL + route).then((res) => res.json())
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
      <div className="bg-white">
        <div className="pt-10 cli-container">
          <div className="flex w-full justify-between items-end">
            <div className="flex flex-col w-full">
              {loading ? (
                <Skeleton h="36px" w="100%" maxW="250px" rounded="lg" />
              ) : (
                <h1 className="font-bold text-[36px]">
                  {agent?.name ?? "Agent"}
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="services">
        <div className="bg-white border-bottom border-neutral-100">
          <div className="pt-10 cli-container">
            <TabList>
              <Tab value="services">Overview</Tab>
              <Tab value="logs">Capabilities</Tab>
              <Tab value="logs">Languages</Tab>
              <Tab value="logs">Protocols</Tab>
            </TabList>
          </div>
        </div>
        <div className="py-10 cli-container">
          <TabContent value="overview">Read me here</TabContent>
        </div>
      </Tabs>
    </>
  );
}

const PluginUsageCard = ({
  usage,
  loading,
}: {
  usage?: any;
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
                <Text color={`textMuted.${colorMode}`}>Module:</Text>
                <Link
                  href={`/module?project=${usage.project}&module=${usage.module}`}
                >
                  <Text cursor="pointer" textDecor="underline">
                    {usage.module}
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
