import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const repoRoot = process.cwd();
const port = process.env.TOWN_CHECK_PORT ?? '4178';
const defaultUrl = `http://127.0.0.1:${port}`;
const outputDir = path.join(repoRoot, 'output', 'town-dev-preview', 'manual-checks');

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
    process.stderr.write(`town manual check server exited with code ${code}\n`);
  }
});

try {
  await waitForServer();
  await runTownChecks();
} finally {
  await stopServer(server.pid);
}

async function runTownChecks() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 2,
  });

  await page.goto(resolvedUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('canvas');
  await page.waitForFunction(() => Boolean(window.__heroSwordDebug && window.__heroSwordGame));
  await waitForVillageAfterBoot(page);
  await tick(page, 1200);
  await page.waitForFunction(() => window.__heroSwordGame?.textures.exists('hero-sword-master-atlas'));
  await page.waitForFunction(() => window.__heroSwordGame?.textures.exists('town:building:armor-shop'));
  await page.waitForFunction(() => window.__heroSwordGame?.textures.exists('town:tile:grass-plain'));
  await tick(page, 300);

  await recordVillageOverview(page);
  await recordShopFlow(page);
  await recordGateFlow(page);
  await recordPalaceFlow(page);
  await recordNpcFlow(page);

  await browser.close();
}

async function waitForVillageAfterBoot(page) {
  const deadline = Date.now() + 60000;

  while (Date.now() < deadline) {
    const activeScenes = await page.evaluate(() => window.__heroSwordGame?.scene.getScenes(true).map((scene) => scene.scene.key) ?? []);
    if (activeScenes.includes('village')) {
      return;
    }
    if (activeScenes.includes('cutscene')) {
      await tapCanvasAt(page, 286, 38);
    }
    if (activeScenes.includes('title')) {
      await tick(page, 1000);
      await tapCanvasAt(page, 180, 548);
    }
    await tick(page, 600);
    await page.waitForTimeout(120);
  }

  throw new Error('Timed out waiting for village scene after boot.');
}

async function tapCanvasCenter(page) {
  await tapCanvasAt(page, 180, 538);
}

async function tapCanvasAt(page, x, y) {
  const canvas = await page.$('canvas');
  if (!canvas) {
    return;
  }

  const box = await canvas.boundingBox();
  if (!box) {
    return;
  }

  await page.mouse.click(box.x + box.width * (x / 360), box.y + box.height * (y / 640));
}

async function recordVillageOverview(page) {
  const states = [];
  await startVillage(page, { x: 768, y: 566 });
  await tick(page, 1100);
  states.push(await captureState(page, 'start'));
  await saveArtifacts(page, 'village-overview', states);
}

async function recordShopFlow(page) {
  const states = [];
  await startVillage(page, { spawnId: 'armor_shop' });
  await tick(page, 500);
  states.push(await captureState(page, 'outside-armor-door'));

  await page.evaluate(() => {
    const activeScene = window.__heroSwordGame?.scene.getScenes(true)[0];
    if (!activeScene) {
      return;
    }

    activeScene.blockedShopAutoEnterIds?.clear?.();
    activeScene.player = { x: 282, y: 936, moving: false };
    activeScene.hero?.setPosition(282, 936);
    activeScene.heroShadow?.setPosition(282, 932);
  });
  await tick(page, 250);
  await waitForScene(page, 'town-interior');
  states.push(await captureState(page, 'auto-entered-interior'));

  await page.evaluate(() => {
    const activeScene = window.__heroSwordGame?.scene.getScenes(true)[0];
    if (!activeScene) {
      return;
    }

    activeScene.player = { x: 360, y: 234, moving: false };
    activeScene.hero?.setPosition(360, 234);
    activeScene.heroShadow?.setPosition(360, 230);
  });
  await tick(page, 150);
  states.push(await captureState(page, 'near-merchant'));

  await startScene(page, 'shop', { shopId: 'armor_shop', returnScene: 'town-interior' });
  await tick(page, 250);
  states.push(await captureState(page, 'shop-opened'));

  await startScene(page, 'town-interior', { shopId: 'armor_shop' });
  await tick(page, 250);
  states.push(await captureState(page, 'back-to-interior'));

  await startVillage(page, { spawnId: 'armor_shop' });
  await tick(page, 250);
  states.push(await captureState(page, 'back-to-town'));

  await saveArtifacts(page, 'shop-flow', states);
}

async function recordGateFlow(page) {
  const states = [];
  await startVillage(page, { spawnId: 'world_gate' });
  await tick(page, 450);
  states.push(await captureState(page, 'near-gate'));

  await startScene(page, 'world-map');
  await tick(page, 250);
  states.push(await captureState(page, 'world-map-opened'));

  await startVillage(page, { spawnId: 'world_gate' });
  await tick(page, 350);
  states.push(await captureState(page, 'returned-from-map'));

  await saveArtifacts(page, 'gate-flow', states);
}

async function recordPalaceFlow(page) {
  const states = [];
  await startVillage(page, { spawnId: 'palace_gate' });
  await tick(page, 450);
  states.push(await captureState(page, 'near-palace-gate'));

  await startScene(page, 'palace');
  await tick(page, 350);
  await tapCanvasCenter(page);
  await tick(page, 180);
  await tapCanvasCenter(page);
  await tick(page, 180);
  await tapCanvasCenter(page);
  await tick(page, 180);
  await page.evaluate(() => {
    const activeScene = window.__heroSwordGame?.scene.getScenes(true)[0];
    if (!activeScene) {
      return;
    }

    activeScene.player = { x: 592, y: 498, moving: false };
    activeScene.hero?.setPosition(592, 498);
    activeScene.heroShadow?.setPosition(592, 494);
  });
  await tick(page, 250);
  states.push(await captureState(page, 'palace-opened'));

  await saveArtifacts(page, 'palace-flow', states);
}

async function recordNpcFlow(page) {
  const states = [];
  await startVillage(page, { x: 448, y: 520 });
  await tick(page, 550);
  if ((await getInteractionKind(page)) !== 'npc') {
    await page.evaluate(() => {
      const activeScene = window.__heroSwordGame?.scene.getScenes(true)[0];
      if (!activeScene) {
        return;
      }

      activeScene.player = { x: 430, y: 516, moving: false };
      activeScene.hero?.setPosition(430, 516);
      activeScene.heroShadow?.setPosition(430, 512);
    });
    await tick(page, 200);
  }
  states.push(await captureState(page, 'near-plaza-npc'));

  await page.evaluate(() => {
    const activeScene = window.__heroSwordGame?.scene.getScenes(true)[0];
    const npc = activeScene?.ambientNpcs?.find((entry) => entry.definition?.id === 'villager_plaza');
    if (npc) {
      activeScene.showDialogue?.(`${npc.definition.name}: ${npc.definition.greeting}`);
    }
  });
  await tick(page, 200);
  states.push(await captureState(page, 'dialog-opened'));

  await saveArtifacts(page, 'npc-flow', states);
}

async function startVillage(page, sceneData) {
  await page.evaluate((payload) => {
    window.__heroSwordDebug?.applyShowcaseSnapshot();
    window.__heroSwordDebug?.clearSession();
  });
  await startScene(page, 'village', sceneData);
}

async function startScene(page, sceneKey, sceneData = undefined) {
  await page.evaluate(
    ({ targetScene, payload }) => {
      const activeScene = window.__heroSwordGame?.scene.getScenes(true)[0];
      if (activeScene) {
        if (activeScene.scene.key === targetScene) {
          activeScene.scene.restart(payload);
          return;
        }

        activeScene.scene.start(targetScene, payload);
        return;
      }

      window.__heroSwordGame?.scene.start(targetScene, payload);
    },
    { targetScene: sceneKey, payload: sceneData },
  );
  await waitForScene(page, sceneKey);
}

async function waitForScene(page, sceneKey) {
  await page.waitForFunction(
    (expected) => window.__heroSwordDebug?.getActiveScene() === expected,
    sceneKey,
  );
}

async function tick(page, ms) {
  await page.evaluate(async (duration) => {
    if (typeof window.advanceTime === 'function') {
      await window.advanceTime(duration);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, duration));
  }, ms);
}

async function captureState(page, label) {
  const raw = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
  return {
    label,
    payload: JSON.parse(raw),
  };
}

async function getInteractionKind(page) {
  return page.evaluate(() => {
    const raw = window.render_game_to_text?.() ?? '{}';
    const parsed = JSON.parse(raw);
    return parsed.activeInteraction?.kind ?? null;
  });
}

async function saveArtifacts(page, filePrefix, states) {
  const canvas = await page.$('canvas');
  if (!canvas) {
    throw new Error(`Missing canvas for ${filePrefix}`);
  }

  await canvas.screenshot({ path: path.join(outputDir, `${filePrefix}.png`) });
  fs.writeFileSync(
    path.join(outputDir, `${filePrefix}.json`),
    JSON.stringify({ states, logs: [] }, null, 2),
  );
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

  throw new Error(`Timed out waiting for town QA server at ${resolvedUrl}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
