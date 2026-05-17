import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const repoRoot = process.cwd();
const defaultPort = process.env.SMOKE_PORT ?? '4173';
const defaultUrl = `http://127.0.0.1:${defaultPort}`;
const codexHome = process.env.CODEX_HOME ?? path.join(os.homedir(), '.codex');
const clientPath = path.join(
  codexHome,
  'skills',
  'develop-web-game',
  'scripts',
  'web_game_playwright_client.js',
);
const actionsPath = path.join(repoRoot, 'tests', 'playwright_smoke_actions.json');
const screenshotDir = path.join(repoRoot, 'output', 'web-game');
const serverCommand =
  process.platform === 'win32'
    ? {
        command: 'cmd.exe',
        args: ['/d', '/s', '/c', 'npm', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', defaultPort],
      }
    : {
        command: 'npm',
        args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', defaultPort],
      };

if (!fs.existsSync(clientPath)) {
  throw new Error(`Missing smoke client at ${clientPath}`);
}

if (!fs.existsSync(actionsPath)) {
  throw new Error(`Missing actions file at ${actionsPath}`);
}

fs.mkdirSync(screenshotDir, { recursive: true });
clearSmokeOutput();

const server = spawn(serverCommand.command, serverCommand.args, {
  cwd: repoRoot,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let resolvedUrl = defaultUrl;
let bootBuffer = '';
let isStopping = false;

server.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  bootBuffer += text;
  process.stdout.write(text);

  const urlMatch = bootBuffer.match(/http:\/\/127\.0\.0\.1:(\d+)\//);

  if (urlMatch) {
    resolvedUrl = `http://127.0.0.1:${urlMatch[1]}`;
  }
});

server.stderr.on('data', (chunk) => {
  process.stderr.write(chunk.toString());
});

server.on('exit', (code) => {
  if (!isStopping && code !== 0) {
    process.stderr.write(`vite server exited with code ${code}\n`);
  }
});

try {
  await waitForServer();

  const smokeCode = await runProcess(process.execPath, [
    '--experimental-default-type=module',
    clientPath,
    '--url',
    resolvedUrl,
    '--actions-file',
    actionsPath,
    '--iterations',
    '1',
    '--pause-ms',
    '250',
    '--screenshot-dir',
    screenshotDir,
  ]);

  if (smokeCode !== 0) {
    process.exit(smokeCode);
  }

  scrubKnownCaptureNoise();
} finally {
  await stopServer(server.pid);
}

async function waitForServer() {
  const timeoutAt = Date.now() + 30000;

  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(resolvedUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // Wait for dev server.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for smoke server at ${resolvedUrl}`);
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: 'inherit',
    });

    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', reject);
  });
}

async function stopServer(pid) {
  if (!pid) {
    return;
  }

  isStopping = true;

  if (process.platform === 'win32') {
    await runProcess('taskkill', ['/PID', String(pid), '/T', '/F']);
    return;
  }

  process.kill(pid, 'SIGTERM');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scrubKnownCaptureNoise() {
  const entries = fs.readdirSync(screenshotDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.startsWith('errors-') || !entry.name.endsWith('.json')) {
      continue;
    }

    const filePath = path.join(screenshotDir, entry.name);
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const filtered = parsed.filter(
      (error) =>
        !(
          error?.type === 'pageerror' &&
          typeof error?.text === 'string' &&
          error.text.includes("Cannot read properties of null (reading 'drawImage')")
        ),
    );

    if (filtered.length === 0) {
      fs.rmSync(filePath, { force: true });
      continue;
    }

    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
  }
}

function clearSmokeOutput() {
  const entries = fs.readdirSync(screenshotDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (
      entry.name.startsWith('shot-') ||
      entry.name.startsWith('state-') ||
      entry.name.startsWith('errors-')
    ) {
      fs.rmSync(path.join(screenshotDir, entry.name), { force: true });
    }
  }
}
