import {
  Badge,
  Box,
  HStack,
  Stack,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";

import type { ServiceInformation } from "@/types";
import { Skeleton } from "@/components/skeleton";

export const DeploymentList = ({
  deployments,
  loading,
}: {
  deployments: ServiceInformation["deployments"];
  loading: boolean;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Text color={`textMuted.${colorMode}`} mb={1}>
        Deployments
      </Text>

      {loading ? (
        <Stack>
          <Skeleton h="16px" w="50%" rounded="base" />
          <Skeleton h="16px" w="45%" rounded="base" />
        </Stack>
      ) : deployments.length === 0 ? (
        <Text fontSize="sm" color={`textMuted.${colorMode}`} opacity={0.6}>
          No deployments found for this service
        </Text>
      ) : (
        <VStack align="stretch" gap={1}>
          {deployments.map((deployment, eIdx) => (
            <Deployment key={eIdx} deployment={deployment} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

const Deployment = ({
  deployment,
}: {
  deployment: ServiceInformation["deployments"][number];
}) => {
  return (
    <HStack gap={2} alignItems="center">
      <Text>{deployment.deployment.name}</Text>
      <Badge fontFamily="mono" fontWeight="normal">
        {deployment.information.version}
      </Badge>
    </HStack>
  );
};
