import { Project } from "@/types";
import { API_URL } from "@/utils/constants";
import useSWR from "swr";

export function useActiveWorkspace() {
  const { data: active, isLoading: isLoadingActive } = useSWR<{
    workspace: string;
    module: string;
    service: string;
  }>("/workspace/information", (route) =>
    fetch(API_URL + route).then((res) => res.json())
  );

  const { data, ...project } = useSWR<Project>(
    `/workspace/inventory`,
    (route) => fetch(API_URL + route).then((res) => res.json())
  );

  const services = {};
  const nodes: { id: string; value: boolean }[] = [];
  const edgesSet = {};
  const edges: { from: `${string}/${string}`; to: `${string}/${string}` }[] = [];

  data?.modules.forEach(mod => {
    mod.services.forEach(service => {
      services[service.name] = service;

      service?.serviceDependencies?.forEach(dependency => {
        edgesSet[`${service.module}/${dependency.name}-${dependency.module}/${dependency.name}`] = {
          to: `${service.module}/${service.name}`,
          from: `${dependency.module}/${dependency.name}`,
        }
      })
    })
  })

  Object.keys(edgesSet).forEach(edge => {
    edges.push(edgesSet[edge])
  })

  return {
    ...project,
    workspace: data,
    isLoading: isLoadingActive || project.isLoading,
    edges,
    nodes,
    services,
  };
}
