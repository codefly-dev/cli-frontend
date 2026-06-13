"use client";

import { useQuery } from "@connectrpc/connect-query";
import { CLI } from "@/gen/codefly/cli/v0/cli_pb";

/**
 * Typed data hooks for the codefly CLI service. Each wraps a Connect RPC via
 * connect-query (TanStack Query under the hood). Centralised here so feature
 * components stay declarative and the data layer is reusable in any React host.
 */

/** Full workspace inventory: modules → services → endpoints/dependencies. */
export function useWorkspaceInventory() {
  return useQuery(CLI.method.getWorkspaceInventory);
}

/** The currently-active workspace / module / service (CLI focus). */
export function useActive() {
  return useQuery(CLI.method.getActive);
}

/** Live flow status (which services are running / their health). */
export function useFlowStatus() {
  return useQuery(CLI.method.getFlowStatus);
}

/** Service dependency graph (nodes + edges) for the whole workspace. */
export function useServiceDependencyGraph() {
  return useQuery(CLI.method.getWorkspaceServiceDependencyGraph);
}
