import { spawn } from "node:child_process";
import process from "node:process";

const children = [];
let shuttingDown = false;

function log(message) {
  process.stdout.write(`${message}\n`);
}

function spawnTask(label, command, cwd) {
  const child =
    process.platform === "win32"
      ? spawn("cmd.exe", ["/d", "/s", "/c", command], {
          cwd,
          env: process.env,
          stdio: "inherit",
        })
      : spawn("sh", ["-lc", command], {
          cwd,
          env: process.env,
          stdio: "inherit",
        });

  children.push(child);

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    log(`[dev] ${label} exited with ${reason}`);
    shutdown(code ?? 1);
  });

  child.on("error", (error) => {
    if (shuttingDown) {
      return;
    }

    log(`[dev] ${label} failed to start: ${error.message}`);
    shutdown(1);
  });
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.pid) {
      continue;
    }

    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
      continue;
    }

    child.kill("SIGTERM");
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 150);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

log("[dev] starting API server on http://localhost:3001");
spawnTask("server", "npm --prefix server run dev", process.cwd());

log("[dev] starting frontend on http://localhost:8080");
spawnTask("web", "npm run dev:web", process.cwd());
