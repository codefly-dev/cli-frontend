import { Dialog, DialogTitle } from "@/components/dialog";
import { Tab, TabContent, TabList, Tabs } from "@/components/tabs";
import { API_URL } from "@/utils/constants";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Fragment } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import protobuf from "react-syntax-highlighter/dist/esm/languages/hljs/protobuf";
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import useSWR from "swr";
import { useActiveWorkspace } from "../use-active-workspace";
import { RestEndpointPreview } from "./rest-endpoint-preview";

SyntaxHighlighter.registerLanguage("protobuf", protobuf);
SyntaxHighlighter.registerLanguage("markdown", markdown);

export function ServiceModal({
  moduleId,
  serviceId,
  open,
  onClose,
  previewService,
  previewAgent,
  undoPreviewHistory,
}: {
  moduleId?: string;
  serviceId?: string;
  open: boolean;
  onClose(): void;
  previewService?(service: `${string}/${string}`): void;
  previewAgent?(agent: `${string}/${string}`): void;
  undoPreviewHistory?(): void;
}) {
  const { workspace, edges } = useActiveWorkspace();

  // until we fix the agent info, disable agent info modal
  const stopSowingAgent = true;

  const service = workspace?.modules
    ?.find((m) => m.name === moduleId)
    ?.services?.find((s) => s.name === serviceId);

  // const { data: serviceDependencies } = useSWR<ServiceDependencies>(
  //   open && project ? `/overall/project/${project?.name}/service-dependency-graph` : null,
  //   (route) => fetch(API_URL + route).then((res) => res.json())
  // );

  const dependsOn = edges
    .filter((edge) => edge.to === `${moduleId}/${service?.name}`)
    .map((edge) => edge.from);

  const requiredBy = edges
    .filter((edge) => edge.from === `${moduleId}/${service?.name}`)
    .map((edge) => edge.to);

  return (
    <>
      <Dialog
        open={open && !!service}
        onOpenChange={(open) => !open && onClose()}
        className="!max-w-[800px]"
      >
        {!!service && (
          <>
            <div className="flex gap-2">
              {!!undoPreviewHistory && (
                <button className="cursor-pointer" onClick={undoPreviewHistory}>
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
              )}

              <DialogTitle>
                {moduleId}/{service.name}
              </DialogTitle>
            </div>

            <div className="flex flex-col">
              <span
                className={stopSowingAgent ? "" : "underline cursor-pointer"}
                onClick={(event) => {
                  event?.stopPropagation();
                  !stopSowingAgent && previewAgent?.(
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

            <div className="flex flex-col gap-2 mt-4">
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

            {service.endpoints.length > 0 && (
              <div className="flex flex-col mt-6">
                <h4 className="text-lg font-semibold">
                  Endpoint
                  {service.endpoints.length !== 1 && "s"} (
                  {service.endpoints.length})
                </h4>
                <Tabs defaultValue={service.endpoints[0].name}>
                  <TabList>
                    {service.endpoints.map((endpoint, idx) => (
                      <Tab key={idx} value={endpoint.name}>
                        {endpoint.name}
                      </Tab>
                    ))}
                  </TabList>
                  {service.endpoints.map((endpoint, idx) => (
                    <TabContent key={idx} value={endpoint.name}>
                      {endpoint.name === "rest" ? (
                        <RestEndpointPreview endpoint={endpoint} />
                      ) : endpoint.name === "grpc" ? (
                        <div className="p-4 mt-3 rounded-xl bg-gray-50 border border-gray-200">
                          {endpoint.api.grpc.proto ? (
                            <SyntaxHighlighter
                              language="protobuf"
                              style={docco}
                            >
                              {atob(endpoint.api.grpc.proto)}
                            </SyntaxHighlighter>
                          ) : (
                            "Unable to load endpoint"
                          )}
                        </div>
                      ) : null}
                    </TabContent>
                  ))}
                </Tabs>
              </div>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}
