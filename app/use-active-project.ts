import { Project } from "@/types";
import { API_URL } from "@/utils/constants";
import useSWR from "swr";

export function useActiveProject() {
  const { data: active, isLoading: isLoadingActive } = useSWR<{
    project: string;
    application: string;
    service: string;
  }>("/active/project/information", (route) =>
    fetch(API_URL + route).then((res) => res.json())
  );

  const { data, ...project } = useSWR<Project>(
    active?.project ? `/overall/project/${active.project}/inventory` : null,
    (route) => fetch(API_URL + route).then((res) => res.json())
  );

  const services = {};
  const nodes:{ id: string; value: boolean }[] = [];
  const edgesSet = {};
  const edges:{ from: `${string}/${string}`; to: `${string}/${string}` }[] = [];

  data?.applications.forEach(application => {
    application.services.forEach(service => {
      services[service.name] = service;

      service?.serviceDependencies?.forEach(dependency => {
        console.log({
          from: `${service.application}/${dependency.name}`,
          to: `${dependency.application}/${dependency.name}`,
        })

        edgesSet[`${service.application}/${dependency.name}-${dependency.application}/${dependency.name}`] = {
          from: `${service.application}/${dependency.name}`,
          to: `${dependency.application}/${dependency.name}`,
        }
      })

      
    })
  })

  Object.keys(edgesSet).forEach(edge => {
    edges.push(edgesSet[edge])
  })
  
  console.log('edgesSet', edgesSet)
  console.log('edges', edges)


  return {
    ...project,
    project: data,
    isLoading: isLoadingActive || project.isLoading,
    edges,
    nodes,
  };
}
