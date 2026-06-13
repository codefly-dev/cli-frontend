import { createConnectTransport } from "@connectrpc/connect-web";

/**
 * Connect transport to the codefly CLI.
 *
 * In production the dashboard is served by the CLI itself, so it talks to the
 * same origin (the CLI mounts the connect-go handler for `codefly.cli.v0.CLI`
 * next to the static file server). In dev (`next dev` on another port) point at
 * the running CLI with NEXT_PUBLIC_CONNECT_URL (defaults to the CLI's web port).
 */
function baseUrl(): string {
  if (process.env.NEXT_PUBLIC_CONNECT_URL) return process.env.NEXT_PUBLIC_CONNECT_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:10001";
}

export const transport = createConnectTransport({
  baseUrl: baseUrl(),
  // Browser ⇄ CLI; the Connect protocol works over plain HTTP/1.1 fetch.
  useBinaryFormat: false,
});
