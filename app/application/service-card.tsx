import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import { Card } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import type { Service } from "@/types";
import { EndpointList } from "./endpoint-list";

export const ServiceCard = ({
  service,
  loading,
}: {
  service?: Service;
  loading?: boolean;
}) => {
  const { colorMode } = useColorMode();
  return (
    <Card>
      {loading ? (
        <Stack>
          <Skeleton h="20px" w="30%" rounded="base" mb={4} />
          <Skeleton h="16px" w="40%" rounded="base" />
          <Flex flexWrap="wrap" gap={2}>
            <Skeleton h="16px" w="50%" rounded="base" />
            <Skeleton h="16px" w="45%" rounded="base" />
            <Skeleton h="16px" w="65%" rounded="base" />
          </Flex>
        </Stack>
      ) : service ? (
        <Flex gap={4} flexDir="column">
          <Box>
            <Heading as="p" fontSize="lg" fontWeight="semibold" mb={1}>
              {service.name ?? "Undefined"}
            </Heading>
            <Text as="span" fontSize="sm" color={`textMuted.${colorMode}`}>
              {service.unique ?? "undefined"}
            </Text>
          </Box>

          <EndpointList service={service} />
        </Flex>
      ) : null}
    </Card>
  );
};
