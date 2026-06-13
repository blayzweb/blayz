import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // Pin the workspace root (a stray lockfile exists higher up in $HOME).
    root: path.join(__dirname),
  },
};

export default nextConfig;
