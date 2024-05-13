import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Text,
  useClipboard,
  useColorMode,
} from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Button } from "@/components/button";
import type { Service } from "@/types";

export const EndpointList = ({ service }: { service: Service }) => {
  const { colorMode } = useColorMode();
  const [show, setShow] = useState(true);

  const handleToggle = () => {
    setShow(!show);
  };

  return (
    <Box>
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Text color={`textMuted.${colorMode}`}>Endpoints</Text>
        <Button
          variant="ghost"
          fontWeight="normal"
          onClick={handleToggle}
          size="xs"
          gap={0}
          display="none"
        >
          {show ? (
            <>
              Hide
              <ChevronDownIcon boxSize={4} />
            </>
          ) : (
            <>
              Show
              <ChevronRightIcon boxSize={4} />
            </>
          )}
        </Button>
      </Flex>

      <Collapse in={show}>
        {service.endpoints.length === 0 ? (
          <Text fontSize="sm" color={`textMuted.${colorMode}`} opacity={0.6}>
            No endpoints found for this service
          </Text>
        ) : (
          <HStack rowGap={0} columnGap={2} flexWrap="wrap">
            {service.endpoints.map((endpoint, eIdx) => (
              <Endpoint key={eIdx} service={service} endpoint={endpoint} />
            ))}
          </HStack>
        )}
      </Collapse>
    </Box>
  );
};

const Endpoint = ({
  service,
  endpoint,
}: {
  service: Service;
  endpoint: Service["endpoints"][number];
}) => {
  const toCopy = `codefly.Endpoint("${service.name}.default${
    endpoint.name === "rest" ? "" : `:${endpoint.name}`
  }")`;
  const { hasCopied, onCopy } = useClipboard(toCopy);

  return (
    <HStack spacing={1}>
      <Text>{endpoint.name}</Text>
      <IconButton
        aria-label="Copy to clipboard"
        variant="ghost"
        size="xs"
        onClick={(event) => {
          event.stopPropagation();
          onCopy();
        }}
        isDisabled={hasCopied}
      >
        {hasCopied ? <CheckIcon /> : <CopyIcon />}
      </IconButton>
    </HStack>
  );
};
