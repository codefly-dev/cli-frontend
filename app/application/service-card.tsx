import { Stack } from "@chakra-ui/react";

import { Card } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import type { Agent, Service } from "@/types";
import { Fragment } from "react";

export const ServiceCard = ({
  service,
  loading,
  previewAgent,
  previewService,
  dependsOn,
  requiredBy,
}: {
  service?: Service;
  loading?: boolean;
  previewAgent?(agent: `${string}/${string}`): void;
  previewService?(service: `${string}/${string}`): void;
  dependsOn?: `${string}/${string}`[];
  requiredBy?: `${string}/${string}`[];
}) => {

  return (
    <Card>
      {loading ? (
        <Stack>
          <Skeleton h="20px" w="30%" rounded="base" mb={4} />
          <Skeleton h="16px" w="40%" rounded="base" />
          <div className="flex flex-wrap gap-2">
            <Skeleton h="16px" w="50%" rounded="base" />
            <Skeleton h="16px" w="45%" rounded="base" />
            <Skeleton h="16px" w="65%" rounded="base" />
          </div>
        </Stack>
      ) : service ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-lg font-semibold mb-1">{service.name}</p>
            <span
              className="underline"
              onClick={(event) => {
                event?.stopPropagation();
                previewAgent?.(
                  `${service.agent.name}/${service.agent.version}`
                );
              }}
            >
              {service.agent.name}:{service.agent.version}
            </span>
            <span className="text-sm text-neutral-500">
              {service.description}
            </span>
          </div>

          {/* <span className="text-neutral-500">
            {service.endpoints.length} Endpoint
            {service.endpoints.length !== 1 && "s"}
          </span> */}

          {[
            { title: "Depends on", list: dependsOn },
            { title: "Required by", list: requiredBy },
          ].map((group) => (
            <Fragment key={group.title}>
              <div className="flex flex-col">
                <span className="text-neutral-500">{group.title}:</span>
                <div className="flex flex-col">
                  {group.list?.length ? (
                    group.list?.map((v) => (
                      <span
                        key={v}
                        className="underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          previewService?.(v);
                        }}
                      >
                        {v}
                      </span>
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      ) : null}
    </Card>
  );
};
