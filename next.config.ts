import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";

/** Collect LAN IPv4 addresses so phones/laptops can load the dev server by IP. */
function getLocalDevOrigins(): string[] {
  const origins = new Set<string>();

  try {
    for (const iface of Object.values(os.networkInterfaces())) {
      if (!iface) continue;
      for (const addr of iface) {
        if (addr.family === "IPv4" && !addr.internal) {
          origins.add(addr.address);
        }
      }
    }
  } catch {
    // networkInterfaces can fail in sandboxes — ALLOWED_DEV_ORIGINS env overrides.
  }

  const fromEnv = process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (fromEnv) fromEnv.forEach((origin) => origins.add(origin));

  return [...origins];
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Required when opening the dev server via http://<your-lan-ip>:3000
  // (Next.js blocks /_next/* cross-origin requests otherwise).
  allowedDevOrigins: getLocalDevOrigins(),
  turbopack: {
    // Pin the workspace root (a stray lockfile exists higher up in $HOME).
    root: path.join(__dirname),
  },
};

export default nextConfig;
