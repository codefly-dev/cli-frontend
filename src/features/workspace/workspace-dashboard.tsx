"use client";

import { Boxes, CircleDot, Layers, Workflow } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DependencyGraph } from "@/features/graph/dependency-graph";
import { ServiceCard } from "@/features/workspace/service-card";
import { useActive, useFlowStatus, useWorkspaceInventory } from "./queries";

export function WorkspaceDashboard() {
  const { data: inventory, isLoading } = useWorkspaceInventory();
  const { data: active } = useActive();
  const { data: flow } = useFlowStatus();

  const services = useMemo(
    () => (inventory?.modules ?? []).flatMap((m) => (m.services ?? []).map((s) => ({ module: m, service: s }))),
    [inventory],
  );

  const runningCount = flow?.runningInformation?.filter((r) => r.running).length ?? 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              {active?.workspace || inventory?.name || "workspace"}
            </h1>
            {active?.service ? <Badge variant="muted">{active.service}</Badge> : null}
          </div>
          <p className="text-sm text-muted-foreground">codefly workspace dashboard</p>
        </div>
        <Badge variant={runningCount > 0 ? "success" : "muted"}>
          <CircleDot className="size-3" />
          {runningCount} running
        </Badge>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={<Boxes className="size-4" />} label="Modules" value={inventory?.modules?.length ?? 0} />
        <Stat icon={<Layers className="size-4" />} label="Services" value={services.length} />
        <Stat icon={<CircleDot className="size-4" />} label="Running" value={runningCount} />
        <Stat
          icon={<Workflow className="size-4" />}
          label="Status"
          value={flow?.runningInformation?.length ? "active" : "idle"}
        />
      </section>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm">Dependency graph</CardTitle>
        </CardHeader>
        <CardContent className="h-[360px] p-0">
          <DependencyGraph />
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Services</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border bg-card" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ module, service }) => (
              <ServiceCard
                key={`${module.name}/${service.name}`}
                moduleName={module.name}
                service={service}
                running={flow?.runningInformation?.some(
                  (r) => r.service === service.name && r.running,
                )}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <div>
          <div className="text-lg font-semibold leading-none">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
