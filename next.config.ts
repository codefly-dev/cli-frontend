import type { NextConfig } from "next";

/**
 * The dashboard ships as a STATIC export embedded into the codefly CLI binary
 * (cli/pkg/web/go-grpc/out). It talks to the CLI's Connect endpoint at runtime
 * from the browser, so there is no Node server in production — hence
 * `output: "export"` + unoptimized images. `trailingSlash` keeps the static
 * file-server (Go http.FileServer) routing happy for nested pages.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // React Compiler — kills manual memoization (required stack).
  reactCompiler: true,
  // The Connect/static split is served by the CLI; keep asset paths root-relative.
  assetPrefix: undefined,
};

export default nextConfig;
