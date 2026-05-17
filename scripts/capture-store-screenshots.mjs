import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const repoRoot = process.cwd();
const defaultPort = process.env.STORE_CAPTURE_PORT ?? '4174';
const defaultUrl = `http://127.0.0.1:${defaultPort}`;
const outputDir = path.join(repoRoot, 'output', 'store-screenshots');
const manifestPath = path.join(outputDir, 'manifest.json');

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

fs.mkdirSync(outputDir, { recursive: true });
clearPreviousCaptures();

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
  await captureStoreShots();
} finally {
  await stopServer(server.pid);
}

async function captureStoreShots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();

  await page.goto(resolvedUrl, { waitUntil: 'load' });
  await page.waitForSelector('canvas');
  await page.waitForFunction(() => Boolean(window.__heroSwordDebug && window.advanceTime));
  await waitForVillageAfterBoot(page);
  await tick(page, 1200);
  await page.evaluate(() => {
    window.__heroSwordDebug?.applyShowcaseSnapshot();
    window.__heroSwordDebug?.clearSession();
  });

  const captures = [
    {
      file: 'store_01_village.png',
      label: 'Village lobby home base',
      scene: 'village',
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.startScene('village');
        });
        await tick(page, 600);
      },
    },
    {
      file: 'store_02_world_map.png',
      label: 'World map continent selection',
      scene: 'world-map',
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.setSelectedContinent('continent_04');
          window.__heroSwordDebug?.startScene('world-map');
        });
        await tick(page, 600);
      },
    },
    {
      file: 'store_03_stage_select.png',
      label: 'Stage select on hard difficulty',
      scene: 'stage-select',
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.setSelectedContinent('continent_03');
          window.__heroSwordDebug?.setSelectedDifficulty('hard');
          window.__heroSwordDebug?.startScene('stage-select');
        });
        await tick(page, 600);
      },
    },
    {
      file: 'store_04_party.png',
      label: 'Party setup with four-slot roster',
      scene: 'party',
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.startScene('party');
        });
        await tick(page, 600);
      },
    },
    {
      file: 'store_05_equipment.png',
      label: 'Equipment management meta loop',
      scene: 'equipment',
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.startScene('equipment');
        });
        await tick(page, 600);
      },
    },
    {
      file: 'store_06_battle_field.png',
      label: 'Field battle with VFX and formation clash',
      scene: 'battle',
      battleSearch: {
        warmupMs: 1800,
        durationMs: 2200,
        stepMs: 200,
        preferredKinds: ['charge', 'projectile', 'slash', 'impact'],
      },
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.setStageSelection({
            continentId: 'continent_03',
            stageId: 'stage_03_05',
            difficulty: 'hard',
          });
          window.__heroSwordDebug?.startScene('battle');
        });
      },
    },
    {
      file: 'store_07_battle_boss.png',
      label: 'Boss battle telegraph and burst moment',
      scene: 'battle',
      battleSearch: {
        warmupMs: 1200,
        durationMs: 4200,
        stepMs: 200,
        preferredKinds: ['burst', 'charge', 'projectile', 'telegraph'],
      },
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.setStageSelection({
            continentId: 'continent_06',
            stageId: 'stage_06_10',
            difficulty: 'hard',
          });
          window.__heroSwordDebug?.startScene('battle');
        });
      },
    },
    {
      file: 'store_08_gacha.png',
      label: 'Gacha reveal result',
      scene: 'gacha',
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.startScene('gacha');
        });
        await tick(page, 300);
        await tapCanvas(page, 126, 604);
        await tick(page, 160);
        await tapCanvas(page, 126, 406);
        await tick(page, 2600);
      },
    },
    {
      file: 'store_09_housing.png',
      label: 'Housing customization screen',
      scene: 'housing',
      setup: async () => {
        await page.evaluate(() => {
          window.__heroSwordDebug?.applyShowcaseSnapshot();
          window.__heroSwordDebug?.clearSession();
          window.__heroSwordDebug?.startScene('housing');
        });
        await tick(page, 600);
      },
    },
  ];

  const manifest = [];

  for (const capture of captures) {
    await capture.setup();
    await waitForScene(page, capture.scene);
    const filePath = path.join(outputDir, capture.file);

    if (capture.battleSearch) {
      const bestFrame = await captureBattleMoment(page, capture.battleSearch);
      fs.writeFileSync(filePath, bestFrame.buffer);
      manifest.push({
        file: capture.file,
        label: capture.label,
        scene: bestFrame.scene,
        state: bestFrame.state,
      });
      continue;
    }

    if (capture.afterSceneMs) {
      await tick(page, capture.afterSceneMs);
    }
    const canvas = await page.$('canvas');

    if (!canvas) {
      throw new Error(`Missing canvas while capturing ${capture.file}`);
    }

    await canvas.screenshot({ path: filePath });
    manifest.push({
      file: capture.file,
      label: capture.label,
      scene: await page.evaluate(() => window.__heroSwordDebug?.getActiveScene() ?? null),
      state: await page.evaluate(() => window.render_game_to_text?.() ?? '{}'),
    });
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  await browser.close();
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

async function waitForVillageAfterBoot(page) {
  await page.evaluate(() => {
    window.__heroSwordGame?.scene.start('boot');
  });

  const deadline = Date.now() + 60000;

  while (Date.now() < deadline) {
    const activeScenes = await page.evaluate(() => window.__heroSwordGame?.scene.getScenes(true).map((scene) => scene.scene.key) ?? []);
    if (activeScenes.includes('village')) {
      return;
    }

    if (activeScenes.includes('cutscene')) {
      await tapCanvas(page, 286, 38);
    }

    if (activeScenes.includes('title')) {
      await tick(page, 1000);
      await tapCanvas(page, 180, 548);
    }

    await tick(page, 600);
    await page.waitForTimeout(100);
  }

  throw new Error('Timed out waiting for village scene after boot.');
}

async function tapCanvas(page, x, y) {
  const canvas = await page.$('canvas');
  if (!canvas) {
    throw new Error('Missing canvas during tap.');
  }

  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error('Canvas has no bounding box during tap.');
  }

  await page.mouse.click(box.x + box.width * (x / 360), box.y + box.height * (y / 640));
}

async function waitForScene(page, sceneKey) {
  await page.waitForFunction(
    (expected) => window.__heroSwordDebug?.getActiveScene() === expected,
    sceneKey,
  );
}

async function captureBattleMoment(page, search) {
  if (search.warmupMs > 0) {
    await tick(page, search.warmupMs);
  }

  let bestFrame = null;

  for (let elapsed = 0; elapsed <= search.durationMs; elapsed += search.stepMs) {
    const canvas = await page.$('canvas');

    if (!canvas) {
      throw new Error('Missing canvas during battle capture search.');
    }

    const state = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
    const scene = await page.evaluate(() => window.__heroSwordDebug?.getActiveScene() ?? null);
    if (scene !== 'battle') {
      if (bestFrame) {
        break;
      }

      if (elapsed < search.durationMs) {
        await tick(page, search.stepMs);
      }
      continue;
    }

    const score = scoreBattleFrame(state, search.preferredKinds);

    if (!bestFrame || score >= bestFrame.score) {
      bestFrame = {
        score,
        scene,
        state,
        buffer: await canvas.screenshot(),
      };
    }

    if (elapsed < search.durationMs) {
      await tick(page, search.stepMs);
    }
  }

  if (!bestFrame) {
    throw new Error('Unable to capture a battle frame.');
  }

  return bestFrame;
}

function scoreBattleFrame(rawState, preferredKinds = []) {
  const parsed = parseDebugState(rawState);
  const effects = Array.isArray(parsed.effects) ? parsed.effects : [];
  const enemies = Array.isArray(parsed.enemies) ? parsed.enemies : [];
  const party = Array.isArray(parsed.party) ? parsed.party : [];
  const kindWeights = {
    burst: 18,
    charge: 12,
    projectile: 9,
    telegraph: 7,
    impact: 5,
    slash: 4,
    buff: 3,
    heal: 2,
  };

  let score = effects.length * 2 + enemies.filter((enemy) => enemy.active).length * 3;

  for (const effect of effects) {
    score += kindWeights[effect.kind] ?? 1;
    if (preferredKinds.includes(effect.kind)) {
      score += 10;
    }
  }

  if (typeof parsed.enemyHp === 'number' && typeof parsed.enemyMaxHp === 'number' && parsed.enemyMaxHp > 0) {
    score += Math.round((1 - parsed.enemyHp / parsed.enemyMaxHp) * 8);
  }

  if (typeof parsed.elapsedMs === 'number') {
    score += Math.min(20, Math.floor(parsed.elapsedMs / 400));
  }

  if (party.some((member) => member.shieldHp > 0 || member.damageBoostMs > 0 || member.guardTauntMs > 0)) {
    score += 8;
  }

  return score;
}

function parseDebugState(rawState) {
  try {
    return JSON.parse(rawState);
  } catch {
    return {};
  }
}

function clearPreviousCaptures() {
  const entries = fs.readdirSync(outputDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (entry.name === 'manifest.json' || /^store_\d+_.+\.png$/.test(entry.name)) {
      fs.rmSync(path.join(outputDir, entry.name), { force: true });
    }
  }
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

  throw new Error(`Timed out waiting for store capture server at ${resolvedUrl}`);
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
