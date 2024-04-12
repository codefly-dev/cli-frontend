import { Card } from "@/components/card";
import { Log } from "@/types";
import { API_URL } from "@/utils/constants";
import { Badge, Flex, Icon, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { ActivityLogIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useActiveProject } from "./use-active-project";

export function ProjectLogs({
  filter,
}: {
  filter?: { application?: string };
}) {
  const [ws, setWs] = useState<WebSocket | null>(
    new WebSocket(API_URL.replace("http://", "ws://") + "/active/project/logs")
  );
  const [logs, setLogs] = useState<any[]>([]);

  const [kind, setKind] = useState<Log["kind"] | null>(null);
  const [search, setSearch] = useState("");

  const [service, setService] = useState<string | null>();

  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2024/01/01")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024/03/10"));
  const { services } = useActiveProject();

  useEffect(() => {
    if (!ws) {
      return;
    }

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.result) {
          setLogs((prev) => [parsedData.result, ...prev]);
        }
      } catch (error) {
        console.log("Unable to parsed WS data", error);
      }
    };

    ws.onclose = () => {
      setWs(null);
    };

    return setWs(null)
  }, [ws]);

  const filteredLogs = useMemo(() => {
    if (!logs.length) {
      return [];
    }

    let _filteredLogs = logs;

    if (filter?.application) {
      _filteredLogs = _filteredLogs.filter(
        (log) => log.application === filter.application
      );
    }

    if (kind) {
      _filteredLogs = _filteredLogs.filter((log) => log.kind === kind);
    }

    if (search) {
      _filteredLogs = _filteredLogs.filter((log) =>
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (service) {

      _filteredLogs = _filteredLogs.filter((log) =>
        log.service === service
      );

    }

    return _filteredLogs;
  }, [logs, filter, kind, search, service]);

  console.log('_filteredLogs', filteredLogs)

  const inputClassNames =
    "w-full h-[32px] border border-neutral-100 rounded-lg px-3 w-full lg:max-w-[250px]";

  return (
    <Card className="flex flex-col gap-[10px]">
      <div className="flex flex-col pb-[15px] border-b border-neutral-100 gap-3">
        <div className="flex gap-[10px] overflow-x-auto">
          {[null, ...Object.keys(services)].map((s, idx) => (
            <Badge
              key={`${s}-${idx}`}
              colorScheme={s === service ? "green" : "gray"}
              rounded="full"
              px="10px"
              py="2px"
              cursor="pointer"
              onClick={() => setService(s as any)}
            >
              {s ?? "ALL"}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            className={inputClassNames}
            placeholder="Search logs..."
            onChange={({ target }) => setSearch(target.value)}
          />
          <div className="">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className={inputClassNames}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className={inputClassNames}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      {filteredLogs.length > 0 ? (
        <div className="overflow-x-auto">
          <Table fontFamily="mono">
            <Tbody>
              {filteredLogs.map((log, idx) => (
                <Tr
                  key={`${log.at}-${idx}`}
                  // sx={{
                  //   td: {
                  //     border: "0",
                  //     borderColor: `border.${colorMode}`,
                  //     px: "10px",
                  //     py: "5px",
                  //   },
                  // }}
                  className="[&>td]:border [&>td]:border-neutral-100 [&>td]:px-[10px] [&>td]:py-[5px]"
                  verticalAlign="top"
                  _hover={{ ".meta": { h: "20px", opacity: "1" } }}
                >
                  <Td
                    // color={`textMuted.${colorMode}`}
                    // pl="0 !important"
                    // whiteSpace="nowrap"
                    className="!pl-0 whitespace-nowrap text-neutral-500"
                  >
                    {new Date(log.at).toLocaleTimeString("en-US", {
                      timeZone: "Europe/Paris",
                    })}
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
                          // fontSize="xs"
                          // color={`textMuted.${colorMode}`}
                          // gap="2px"
                          className="flex gap-[2px] text-neutral-500 text-xs"
                        >
                          {label}:{" "}
                          <span
                            key={label}
                            // as="span"
                            // color={`text.${colorMode}`}
                            className="text-neutral-500"
                          >
                            {value}
                          </span>
                        </Flex>
                      ))}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      ) : (
        <Flex
          w="100%"
          h="100%"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          padding={4}
          gap={2}
        >
          <Icon
            as={ActivityLogIcon}
            // boxSize={6}
            // color={`textMuted.${colorMode}`}
            // opacity={0.5}
            className="text-neutral-500 opacity-50 w-6 h-6"
          />
          <span className="text-neutral-500">No logs found</span>
        </Flex>
      )}
    </Card>
  );
}
