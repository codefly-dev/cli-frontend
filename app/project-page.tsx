import { Card } from "@/components/card";
import { ErrorCard } from "@/components/error-card";
import { Skeleton } from "@/components/skeleton";
import { Tab, TabContent, TabList, Tabs } from "@/components/tabs";
import type { Application } from "@/types";
import { API_URL } from "@/utils/constants";
import { Box, Container, GridItem, Icon, Stack } from "@chakra-ui/react";
import { CodeIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Link from "next/link";
import pluralize from "pluralize";
import useSWR from "swr";
import {
  DependencyTree,
  Tree,
  type ApplicationDependencyGraph,
} from "./dependency-graph";
import { ProjectLogs } from "./project-logs";
import { useActiveProject } from "./use-active-project";

export function ProjectPage() {
  const { project, error, isLoading } = useActiveProject();

  const { data: dependendyGraphs } = useSWR<{
    graphs: ApplicationDependencyGraph[];
  }>(`/overall/project/${project?.name}/public-applications-graph`, (route) =>
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
            <div className="flex flex-col gap-2 w-full">
              {isLoading ? (
                <Skeleton h="36px" w="100%" maxW="250px" rounded="lg" />
              ) : (
                <h1 className="font-bold text-[36px]">
                  {project?.name ?? "Project"}
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
              <Tab value="services">Applications</Tab>
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
                !isLoading && !project ? "" : "grid-cols-3"
              )}
            >
              {isLoading ? (
                Array.from(Array(9).keys()).map((idx) => (
                  <GridItem key={idx}>
                    <ApplicationCard isLoading />
                  </GridItem>
                ))
              ) : !project ? (
                <ErrorCard message="Unable to load project" />
              ) : project.applications.length > 0 ? (
                project.applications.map((application, idx) => (
                  <div key={idx}>
                    <ApplicationCard
                      application={application}
                      projectId={project.name}
                    />
                  </div>
                ))
              ) : (
                <span>No applications found</span>
              )}
            </div>
          </TabContent>
          <TabContent value="logs">
            <ProjectLogs />
          </TabContent>
          <TabContent value="graph">
            <DependencyTree
              trees={transformDependencyGraphs(dependendyGraphs?.graphs)}
            />
          </TabContent>
        </div>
      </Tabs>
    </>
  );
}

const ApplicationCard = ({
  application,
  projectId,
  isLoading,
}: {
  application?: Application;
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
      ) : application ? (
        <Link href={`/application?application=${application.name}`}>
          <Box>
            <p className="text-lg font-semibold mb-1">{application.name}</p>
            <span className="text-sm">
              {application.description ?? "No description"}
            </span>

            <div className="flex items-center mt-6 gap-2">
              <Icon as={CodeIcon} />
              <span className="text-sm">
                {pluralize("service", application.services.length, true)}
              </span>
            </div>
          </Box>
        </Link>
      ) : null}
    </Card>
  );
};

function transformDependencyGraphs(
  graphs?: ApplicationDependencyGraph[]
): Tree[] {
  if (!graphs) {
    return [];
  }

  return graphs.map((graph) => {
    const root = graph.nodes.find((node) => node.type === "APPLICATION");
    const services = graph.nodes.filter((node) => node.type === "SERVICE");
    const servicesWithChildren = services.map((service) => {
      return {
        ...service,
        id: service.id.replace(`${root!.id}/`, ""),
        children: graph.nodes
          .filter((e) => e.type === "ENDPOINT" && e.id.startsWith(service.id))
          .map((e) => ({ ...e, id: e.id.replace(`${service.id}/`, "") })),
      };
    });
    return { ...root!, children: servicesWithChildren };
  });
}
