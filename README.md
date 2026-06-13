# cli-frontend

The codefly **workspace dashboard** — served by the CLI (`codefly run service` /
`codefly server`) at its web port. A static Next.js export embedded into the CLI
binary at `cli/pkg/web/go-grpc/out`.

## Stack (codefly frontend standard)

- **Next 16** (App Router, static export) + **React 19** with the **React Compiler**
- **Connect-ES** (`@connectrpc/connect` + `connect-web`) over the CLI's
  `codefly.cli.v0.CLI` service — **not REST**
- **TanStack Query** via `@connectrpc/connect-query`
- **shadcn/ui** (Radix + CVA) on **Tailwind v4**, dark-first design tokens
- **Zod**, **Vitest** + **Playwright**, TypeScript strict

## Architecture (modular / SaaS-ready)

Structured so the dashboard can later be lifted into a hosted codefly SaaS — the
design system and feature modules are self-contained and host-agnostic:

```
src/
  gen/                     # generated Connect-ES clients (npm run gen) — gitignored
  lib/                     # transport, providers (Connect + TanStack + theme), utils
  components/ui/           # shadcn design system — SHAREABLE
  features/                # self-contained feature modules — SHAREABLE
    workspace/             #   dashboard, service cards, data hooks (queries.ts)
    graph/                 #   dependency graph (React Flow / @xyflow)
    agents/  modules/  logs/  endpoints/   (follow-up pages)
  app/                     # thin Next App Router shell that composes features
```

The data layer (`features/*/queries.ts`) wraps the CLI's Connect RPCs with
TanStack Query — declarative, typed, reusable in any React host.

## Develop

```bash
npm install
npm run gen          # generate Connect-ES clients from ../proto (codefly cli service)
# point at a running CLI web server (codefly run service serves it):
NEXT_PUBLIC_CONNECT_URL=http://localhost:10001 npm run dev
```

## Build + embed into the CLI

```bash
npm run gen && npm run build      # static export -> ./out
rm -rf ../cli/pkg/web/go-grpc/out && cp -r out ../cli/pkg/web/go-grpc/out
# then rebuild the CLI:  (cd ../cli && codefly self build)
```

> The CLI mounts a **connect-go** handler for `codefly.cli.v0.CLI` next to the
> static file server, so the browser talks Connect to the same origin. See
> `cli/pkg/web/go-grpc/http.go`.
