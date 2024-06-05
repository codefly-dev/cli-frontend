import { Card } from "@/components/card";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/skeleton";
import { Tab, TabContent, TabList, Tabs } from "@/components/tabs";
import type { Module } from "@/types";
import { API_URL } from "@/utils/constants";
import { Box, Container, GridItem, Icon, Stack } from "@chakra-ui/react";
import { CodeIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Link from "next/link";
import pluralize from "pluralize";
import useSWR from "swr";
import { DependencyTree, Tree, type DependencyMap } from "./dependency-graph";
import { WorkspaceLogs } from "./workspace-logs";
import { useActiveWorkspace } from "./use-active-workspace";

export function WorkspacePage() {
  const { workspace: workspace, error, isLoading } = useActiveWorkspace();

  const { data: dependendyGraphs } = useSWR<{
    graphs: DependencyMap[];
  }>(workspace?.name ? `/workspace/public-endpoints-graph` : null,
    (route) => fetch(API_URL + route).then((res) => res.json())
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
            <div className="flex flex-col gap-2 w-full">
              {isLoading ? (
                <Skeleton h="36px" w="100%" maxW="250px" rounded="lg" />
              ) : (
                <h1 className="font-bold text-[36px]">
                  {workspace?.name ?? "Worksace"}
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
              <Tab value="services">Modules</Tab>
              <Tab value="logs">Logs</Tab>
              <Tab value="graph">Dependency Graph</Tab>
            </TabList>
          </div>
        </div>
        <div className="py-10 cli-container">
          <TabContent value="services">
            <div
              className={clsx(
                "grid gap-6 w-full",
                !isLoading && !workspace ? "" : "grid-cols-3"
              )}
            >
              {isLoading ? (
                Array.from(Array(9).keys()).map((idx) => (
                  <GridItem key={idx}>
                    <ModuleCard isLoading />
                  </GridItem>
                ))
              ) : !workspace ? (
                <ErrorCard message="Unable to load project" />
              ) : workspace.modules.length > 0 ? (
                workspace.modules.map((mod, idx) => (
                  <div key={idx}>
                    <ModuleCard
                      mod={mod}
                      projectId={workspace.name}
                    />
                  </div>
                ))
              ) : (
                <span>No applications found</span>
              )}
            </div>
          </TabContent>
          <TabContent value="logs">
            <WorkspaceLogs />
          </TabContent>
          <TabContent value="graph">
            {dependendyGraphs?.graphs && dependendyGraphs.graphs.length > 0 ? (
              <DependencyTree
                trees={transformDependencyGraphs(dependendyGraphs?.graphs)}
              />
            ) : (
              <span>No graphs found</span>
            )}
          </TabContent>
        </div>
      </Tabs>
    </>
  );
}

const ModuleCard = ({
  mod,
  projectId,
  isLoading,
}: {
  mod?: Module;
  projectId?: string;
  isLoading?: boolean;
}) => {
  return (
    <Card>
      {isLoading ? (
        <Stack>
          <Skeleton h="20px" w="30%" rounded="base" mb={1} />
          <Skeleton h="16px" w="40%" rounded="base" />

          <Skeleton h="16px" w="35%" rounded="base" mt={6} />
        </Stack>
      ) : mod ? (
        <Link href={`/module?module=${mod.name}`}>
          <Box>
            <p className="text-lg font-semibold mb-1">{mod.name}</p>
            <span className="text-sm">
              {mod.description ?? "No description"}
            </span>

            <div className="flex items-center mt-6 gap-2">
              <Icon as={CodeIcon} />
              <span className="text-sm">
                {pluralize("service", mod.services.length, true)}
              </span>
            </div>
          </Box>
        </Link>
      ) : null}
    </Card>
  );
};

function transformDependencyGraphs(graphs?: DependencyMap[]): Tree[] {
  if (!graphs) {
    return [];
  }

  return graphs.map((graph) => {
    const root = graph.nodes.find((node) => node.type === "MODULE");
    if (!root) {
      throw new Error("No root found in dependency graph");
    }
    const services = graph.nodes.filter((node) => node.type === "SERVICE");
    const servicesWithChildren = services.map((service) => {
      return {
        ...service,
        id: service.id.replace(`${root!.id}/`, ""),
        children: graph.nodes
          .filter((e) => e.type === "ENDPOINT" && e.id.startsWith(service.id))
          .map(
            (e) =>
            ({
              ...e,
              id: e.id.replace(`${service.id}/`, ""),
              children: [],
            } satisfies Tree)
          ),
      };
    });
    return { ...root, children: servicesWithChildren } satisfies Tree;
  });
}
