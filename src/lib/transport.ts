import { createConnectTransport } from "@connectrpc/connect-web";

/**
 * Connect transport to the codefly CLI.
 *
 * - Production (embedded static export): served BY the CLI, so same origin.
 * - Dev (`next dev` on :3000): cross-origin to the running CLI — default to the
 *   CLI's web port so `npm run dev` works with zero config. Override the port /
 *   workspace with NEXT_PUBLIC_CONNECT_URL (the port is derived from the
 *   workspace name, so a non-default workspace needs this).
 */
function baseUrl(): string {
  if (process.env.NEXT_PUBLIC_CONNECT_URL) return process.env.NEXT_PUBLIC_CONNECT_URL;
  // Dev: window.location.origin is the Next dev server (no CLI API there), so
  // target the CLI's default web port instead.
  if (process.env.NODE_ENV === "development") return "http://localhost:10001";
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:10001";
}

export const transport = createConnectTransport({
  baseUrl: baseUrl(),
  // Browser ⇄ CLI; the Connect protocol works over plain HTTP/1.1 fetch.
  useBinaryFormat: false,
});
