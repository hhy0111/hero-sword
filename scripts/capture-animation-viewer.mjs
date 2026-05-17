import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const repoRoot = process.cwd();
const port = process.env.ANIMATION_VIEWER_CAPTURE_PORT ?? '4175';
const defaultUrl = `http://127.0.0.1:${port}`;
const outputDir = path.join(repoRoot, 'output', 'animation-viewer');

const serverCommand =
  process.platform === 'win32'
    ? {
        command: 'cmd.exe',
        args: ['/d', '/s', '/c', 'npm', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', port],
      }
    : {
        command: 'npm',
        args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', port],
      };

fs.mkdirSync(outputDir, { recursive: true });

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
    process.stderr.write(`viewer capture server exited with code ${code}\n`);
  }
});

try {
  await waitForServer();
  await captureViewer();
} finally {
  await stopServer(server.pid);
}

async function captureViewer() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 720 },
    deviceScaleFactor: 2,
  });

  await page.goto(resolvedUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('canvas');
  await page.waitForFunction(() => Boolean(window.__heroSwordDebug));
  await page.evaluate(() => {
    window.__heroSwordGame?.scene.start('boot');
  });
  await page.waitForFunction(() => window.__heroSwordGame?.scene.getScenes(true).some((scene) => scene.scene.key === 'village'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    window.__heroSwordDebug?.applyShowcaseSnapshot();
    window.__heroSwordDebug?.clearSession();
    window.__heroSwordDebug?.startScene('animation-viewer');
  });
  await page.waitForFunction(() => window.__heroSwordGame?.scene.getScenes(true).some((scene) => scene.scene.key === 'animation-viewer'));
  await page.waitForSelector('[data-viewer-field="category"]');
  await page.waitForTimeout(300);

  await page.screenshot({
    path: path.join(outputDir, 'animation_viewer_character.png'),
  });
  await writeViewerState(page, 'animation_viewer_character_state.json');
  const characterCanvas = await page.$('canvas');
  if (!characterCanvas) {
    throw new Error('Missing canvas for character viewer capture');
  }
  await characterCanvas.screenshot({
    path: path.join(outputDir, 'animation_viewer_character_canvas.png'),
  });

  await page.selectOption('[data-viewer-field="category"]', 'enemy');
  await page.waitForTimeout(150);
  await page.selectOption('[data-viewer-field="subject"]', 'morgan');
  await page.waitForTimeout(150);
  await page.selectOption('[data-viewer-field="action"]', 'slam_burst');
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(outputDir, 'animation_viewer_enemy.png'),
  });
  await writeViewerState(page, 'animation_viewer_enemy_state.json');
  const enemyCanvas = await page.$('canvas');
  if (!enemyCanvas) {
    throw new Error('Missing canvas for enemy viewer capture');
  }
  await enemyCanvas.screenshot({
    path: path.join(outputDir, 'animation_viewer_enemy_canvas.png'),
  });

  await page.selectOption('[data-viewer-field="category"]', 'npc');
  await page.waitForTimeout(150);
  await page.selectOption('[data-viewer-field="subject"]', 'weapon_merchant');
  await page.waitForTimeout(150);
  await page.selectOption('[data-viewer-field="action"]', 'turn_short_rotation');
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(outputDir, 'animation_viewer_npc.png'),
  });
  await writeViewerState(page, 'animation_viewer_npc_state.json');
  const npcCanvas = await page.$('canvas');
  if (!npcCanvas) {
    throw new Error('Missing canvas for npc viewer capture');
  }
  await npcCanvas.screenshot({
    path: path.join(outputDir, 'animation_viewer_npc_canvas.png'),
  });

  await page.selectOption('[data-viewer-field="category"]', 'effect');
  await page.waitForTimeout(150);
  await page.selectOption('[data-viewer-field="subject"]', 'boss_battle');
  await page.waitForTimeout(150);
  await page.selectOption('[data-viewer-field="action"]', 'fx_burst_boss');
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(outputDir, 'animation_viewer_effect.png'),
  });
  await writeViewerState(page, 'animation_viewer_effect_state.json');
  const effectCanvas = await page.$('canvas');
  if (!effectCanvas) {
    throw new Error('Missing canvas for effect viewer capture');
  }
  await effectCanvas.screenshot({
    path: path.join(outputDir, 'animation_viewer_effect_canvas.png'),
  });

  await browser.close();
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
      // Wait for Vite dev server.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for animation viewer server at ${resolvedUrl}`);
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

async function writeViewerState(page, fileName) {
  const state = await page.evaluate(() => {
    if (typeof window.render_game_to_text !== 'function') {
      return null;
    }

    return window.render_game_to_text();
  });

  fs.writeFileSync(path.join(outputDir, fileName), `${state ?? ''}\n`);
}
