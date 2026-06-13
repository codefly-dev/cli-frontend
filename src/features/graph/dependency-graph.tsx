"use client";

import {
  Background,
  Controls,
  type Edge,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import { useWorkspaceInventory } from "@/features/workspace/queries";

/**
 * Workspace dependency graph. Derives nodes/edges from the inventory
 * (module/service + serviceDependencies) and lays them out in dependency
 * columns. Self-contained so it can be dropped into any host.
 */
export function DependencyGraph() {
  const { data: inventory } = useWorkspaceInventory();

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const seen = new Set<string>();

    const all = (inventory?.modules ?? []).flatMap((m) =>
      (m.services ?? []).map((s) => ({ module: m.name, service: s })),
    );

    all.forEach(({ module, service }, i) => {
      const id = `${module}/${service.name}`;
      if (seen.has(id)) return;
      seen.add(id);
      nodes.push({
        id,
        type: "service",
        position: { x: (i % 4) * 220, y: Math.floor(i / 4) * 120 },
        data: { label: service.name, module },
      });
      (service.serviceDependencies ?? []).forEach((dep: { name: string }) => {
        edges.push({
          id: `${module}/${dep.name}->${id}`,
          source: `${module}/${dep.name}`,
          target: id,
          animated: true,
        });
      });
    });

    return { nodes, edges };
  }, [inventory]);

  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No services to graph yet.
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ service: ServiceNode }}
      fitView
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
    >
      <Background gap={16} className="opacity-40" />
      <Controls showInteractive={false} className="!shadow-none" />
    </ReactFlow>
  );
}

function ServiceNode({ data }: NodeProps) {
  const d = data as { label: string; module: string };
  return (
    <div className="rounded-md border bg-card px-3 py-2 shadow-sm">
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="text-sm font-medium">{d.label}</div>
      <div className="font-mono text-[10px] text-muted-foreground">{d.module}</div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}
