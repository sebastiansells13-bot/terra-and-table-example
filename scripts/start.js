#!/usr/bin/env node
// Dev entrypoint. Simpler than the other examples' start.js — there's no
// Sass to watch in parallel since this site styles with Tailwind's CDN
// script instead of a local stylesheet build.
import { spawn } from "node:child_process";
import { rmSync } from "node:fs";

function clean() {
  rmSync("dev", { recursive: true, force: true });
  rmSync("docs", { recursive: true, force: true });
}

clean();

const child = spawn("npm run watch:eleventy", { stdio: "inherit", shell: true });

function shutdown() {
  child.kill();
  clean();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
child.on("exit", (code) => {
  clean();
  process.exit(code ?? 0);
});
