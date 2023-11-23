import type { Log } from "@/types";
import {
  Badge,
  Box,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { Card } from "./card";
import { useMemo, useState } from "react";

export function Logs({ logs }: { logs: Log[] }) {
  const { colorMode } = useColorMode();

  const [kind, setKind] = useState<Log["kind"] | null>(null);
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    let _filteredLogs = logs;

    if (kind) {
      _filteredLogs = _filteredLogs.filter((log) => log.kind === kind);
    }

    if (search) {
      _filteredLogs = _filteredLogs.filter((log) =>
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    return _filteredLogs;
  }, [kind, search, logs]);

  return (
    <Card display="flex" flexDir="column" gap="10px">
      <Flex
        pb="15px"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor={`border.${colorMode}`}
      >
        <Flex gap="10px">
          {[null, "UNKNOWN", "PLUGIN", "SERVICE"].map((k, idx) => (
            <Badge
              key={`${k}-${idx}`}
              colorScheme={k === kind ? "green" : "gray"}
              rounded="full"
              px="10px"
              py="2px"
              cursor="pointer"
              onClick={() => setKind(k as any)}
            >
              {k ?? "ALL"}
            </Badge>
          ))}
        </Flex>

        <Input
          maxW="250px"
          h="32px"
          placeholder="Search logs..."
          onChange={({ target }) => setSearch(target.value)}
        />
      </Flex>

      <Table fontFamily="mono">
        <Tbody>
          {filteredLogs.map((log, idx) => (
            <Tr
              key={`${log.at}-${idx}`}
              sx={{
                td: {
                  border: "0",
                  borderColor: `border.${colorMode}`,
                  px: "10px",
                  py: "5px",
                },
              }}
              _hover={{ ".meta": { h: "20px", opacity: "1" } }}
            >
              <Td color={`textMuted.${colorMode}`} pl="0 !important">
                {log.at}
              </Td>
              <Td w="100%" position="relative">
                <span>{log.message}</span>
                <Flex
                  className="meta"
                  h="0"
                  opacity="0"
                  columnGap="20px"
                  transition="all 0.2s"
                  overflow="hidden"
                >
                  {[
                    ["Application", log.application],
                    ["Service", log.service],
                    ["Kind", log.kind],
                  ].map(([label, value], idx) => (
                    <Flex
                      key={`${label}-${idx}`}
                      fontSize="xs"
                      color={`textMuted.${colorMode}`}
                      gap="2px"
                    >
                      {label}:{" "}
                      <Text key={label} as="span" color={`text.${colorMode}`}>
                        {value}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
