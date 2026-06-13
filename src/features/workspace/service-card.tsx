"use client";

import { ArrowUpRight, Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Structurally typed against the generated codefly.base.v0.Service — kept loose
// so the component is resilient to proto field additions.
interface ServiceLike {
  name: string;
  serviceDependencies?: { name: string }[];
  endpoints?: { name: string; api?: string }[];
}

export function ServiceCard({
  moduleName,
  service,
  running,
}: {
  moduleName: string;
  service: ServiceLike;
  running?: boolean;
}) {
  const deps = service.serviceDependencies ?? [];
  const endpoints = service.endpoints ?? [];

  return (
    <Card className="group transition-colors hover:border-primary/40">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="flex items-center gap-2 text-sm">
            {service.name}
            <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </CardTitle>
          <span className="font-mono text-xs text-muted-foreground">{moduleName}</span>
        </div>
        <Badge variant={running ? "success" : "muted"}>{running ? "running" : "idle"}</Badge>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {endpoints.map((e) => (
          <Badge key={e.name} variant="outline">
            <Plug className="size-3" />
            {e.api ?? e.name}
          </Badge>
        ))}
        {deps.length > 0 ? (
          <Badge variant="secondary">{deps.length} deps</Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
