import { BreadcrumbLink } from "@/components/breadcrumb-link";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/skeleton";
import { Tab, TabContent, TabList, Tabs } from "@/components/tabs";
import type { Module, ServiceDependencies } from "@/types";
import { API_URL } from "@/utils/constants";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AgentModal } from "../agent/agent-modal";
import { WorkspaceLogs } from "../workspace-logs";
import { useActiveWorkspace } from "../use-active-workspace";
import { ServiceCard } from "./service-card";
import { ServiceModal } from "./service-modal";

export function ModulePage({ moduleId }: { moduleId: string }) {
  const { workspace, error, isLoading: loading, nodes, edges } = useActiveWorkspace();
  // const { data: serviceDependencies } = useSWR<ServiceDependencies>(
  //   project
  //     ? `/overall/project/${project?.name}/service-dependency-graph`
  //     : null,
  //   (route) => fetch(API_URL + route).then((res) => res.json())
  // );

  if (error) {
    return (
      <div className="h-[60vh] cli-container">
        <ErrorCard message={error?.message} />
      </div>
    );
  }

  const mod = workspace?.modules?.find(
    (a) => a.name === moduleId
  );

  return (
    <ModuleServices
      module={mod}
      serviceDependencies={{
        nodes,
        edges,
      }}
      loading={loading}
    />
  );
}

export function ModuleServices({
  module,
  serviceDependencies,
  loading,
}: {
  module?: Module;
  serviceDependencies?: ServiceDependencies;
  loading: boolean;
}) {
  const [previewHistory, setPreviewHistory] = useState<
    { type: "agent" | "service"; id: `${string}/${string}` }[]
  >([]);

  const preview = previewHistory.length
    ? previewHistory?.[previewHistory.length - 1]
    : null;

  console.log('previewHistory', previewHistory)
  console.log('preview', preview)
  console.log('module', module)

  // const [ preview, setPreview] = useState();

  // useEffect(() => {}, [])

  const undoPreviewHistory =
    previewHistory?.length > 1
      ? () => {
          setPreviewHistory((prev) => {
            const newHistory = [...prev];
            newHistory.pop();
            return newHistory;
          });
        }
      : undefined;

  return (
    <>
      <div className="bg-white">
        <div className="pt-10 cli-container">
          <div className="flex w-full justify-between items-end">
            <div className="flex flex-col w-full">
              <BreadcrumbLink href={`/`}>Modules</BreadcrumbLink>
              {loading ? (
                <Skeleton h="36px" w="100%" maxW="250px" rounded="lg" />
              ) : (
                <h1 className="font-bold text-[36px]">
                  {module?.name ?? "Module"}
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
              <Tab value="services">Services</Tab>
              <Tab value="logs">Logs</Tab>
            </TabList>
          </div>
        </div>
        <div className="py-10 cli-container">
          <TabContent value="services">
            <div
              className={clsx(
                "grid gap-6 w-full",
                !loading && !module ? "" : "grid-cols-3"
              )}
            >
              {loading ? (
                Array.from(Array(9).keys()).map((idx) => (
                  <div key={idx}>
                    <ServiceCard loading />
                  </div>
                ))
              ) : !module ? (
                <ErrorCard message="Unable to load module" />
              ) : module.services.length > 0 ? (
                <>
                  <ServiceModal
                    serviceId={preview?.id.split("/")[1]}
                    moduleId={preview?.id.split("/")[0]}
                    previewService={(id) =>
                      setPreviewHistory((prev) => [
                        ...prev,
                        { type: "service", id },
                      ])
                    }
                    previewAgent={(id) =>
                      setPreviewHistory((prev) => [
                        ...prev,
                        { type: "agent", id },
                      ])
                    }
                    undoPreviewHistory={undoPreviewHistory}
                    // open={!!preview && preview.type === "service"}
                    open={true}
                    onClose={() => setPreviewHistory([])}
                  />

                  <AgentModal
                    name={preview?.id.split("/")[0]}
                    version={preview?.id.split("/")[1]}
                    open={!!preview && preview.type === "agent"}
                    onClose={() => setPreviewHistory([])}
                    undoPreviewHistory={undoPreviewHistory}
                  />

                  {module.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer"
                      onClick={() =>
                        setPreviewHistory([
                          {
                            id: `${module.name}/${service.name}`,
                            type: "service",
                          },
                        ])
                      }
                    >
                      <ServiceCard
                        service={service}
                        previewAgent={(id) =>
                          setPreviewHistory([{ id, type: "agent" }])
                        }
                        previewService={(id) =>
                          setPreviewHistory([{ id, type: "service" }])
                        }
                        dependsOn={serviceDependencies?.edges
                          .filter(
                            (edge) =>
                              edge.to === `${module.name}/${service.name}`
                          )
                          .map((edge) => edge.from)}
                        requiredBy={serviceDependencies?.edges
                          .filter(
                            (edge) =>
                              edge.from ===
                              `${module.name}/${service.name}`
                          )
                          .map((edge) => edge.to)}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <span>No services found</span>
              )}
            </div>
          </TabContent>
          <TabContent value="logs">
            <WorkspaceLogs filter={{ module: module?.name }} />
          </TabContent>
        </div>
      </Tabs>
    </>
  );
}
