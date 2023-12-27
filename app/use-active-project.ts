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

  return {
    ...project,
    project: data,
    isLoading: isLoadingActive || project.isLoading,
  };
}
