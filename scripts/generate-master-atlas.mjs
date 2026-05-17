import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const cell = 64;
const cols = 4;
const rows = 4;
const width = cell * cols;
const height = cell * rows;
const bytes = Buffer.alloc(width * height * 4, 0);

const outPaths = [
  path.join(process.cwd(), 'assets', 'hero_sword_master_atlas.png'),
  path.join(process.cwd(), 'public', 'assets', 'hero_sword_master_atlas.png'),
];

main();

function main() {
  drawGrassTile(0, 0);
  drawStoneTile(1, 0);
  drawHouse(2, 0);
  drawHero(3, 0);
  drawSwordIcon(0, 1);
  drawMapIcon(1, 1);
  drawHomeIcon(2, 1);
  drawBagIcon(3, 1);
  drawStageNode(0, 2, false);
  drawStageNode(1, 2, true);
  drawContinentBadge(2, 2, true);
  drawContinentBadge(3, 2, false);
  drawStar(0, 3);
  drawButtonFrame(1, 3, 0x4678d8, 0xdfe9ff);
  drawButtonFrame(2, 3, 0xd8a83f, 0xfff2b4);
  drawPanelFrame(3, 3);

  const png = encodePng(width, height, bytes);

  for (const outPath of outPaths) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, png);
    console.log(`generated ${outPath}`);
  }
}

function drawGrassTile(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillRect(ox, oy, cell, cell, 0x6fa650);
  fillRect(ox, oy + 38, cell, 26, 0x4d6f38);
  for (let i = 0; i < 18; i += 1) {
    const x = ox + 4 + ((i * 17) % 54);
    const y = oy + 6 + ((i * 11) % 44);
    fillRect(x, y, 3, 3, i % 2 === 0 ? 0x8bc56b : 0x5d8e45);
  }
  fillRect(ox + 24, oy + 8, 16, 48, 0x9f7a49);
  fillRect(ox + 26, oy + 8, 12, 48, 0xc79e68);
}

function drawStoneTile(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillRect(ox, oy, cell, cell, 0x8f96a3);
  for (let y = 0; y < 4; y += 1) {
    for (let x = 0; x < 4; x += 1) {
      const px = ox + x * 16;
      const py = oy + y * 16;
      fillRect(px + 1, py + 1, 14, 14, (x + y) % 2 === 0 ? 0xb8bfca : 0xa5adb8);
      strokeRect(px + 1, py + 1, 14, 14, 0x727985);
    }
  }
}

function drawHouse(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillRect(ox + 12, oy + 28, 40, 26, 0xc9a16b);
  strokeRect(ox + 12, oy + 28, 40, 26, 0x4a3320);
  fillTriangle(ox + 8, oy + 30, ox + 32, oy + 10, ox + 56, oy + 30, 0x9d4c34);
  strokeLine(ox + 8, oy + 30, ox + 32, oy + 10, 0x4a3320);
  strokeLine(ox + 32, oy + 10, ox + 56, oy + 30, 0x4a3320);
  fillRect(ox + 27, oy + 38, 10, 16, 0x71472d);
  fillRect(ox + 18, oy + 36, 6, 6, 0x98d8ff);
  fillRect(ox + 40, oy + 36, 6, 6, 0x98d8ff);
}

function drawHero(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillCircle(ox + 32, oy + 20, 10, 0xf0d39d);
  fillRect(ox + 24, oy + 29, 16, 16, 0x5074b5);
  fillRect(ox + 26, oy + 45, 5, 10, 0x5a3f2b);
  fillRect(ox + 33, oy + 45, 5, 10, 0x5a3f2b);
  fillRect(ox + 20, oy + 32, 4, 11, 0xf0d39d);
  fillRect(ox + 40, oy + 32, 4, 11, 0xf0d39d);
  fillRect(ox + 44, oy + 26, 5, 20, 0x7b8ca6);
  fillRect(ox + 46, oy + 18, 2, 10, 0xd8e4ef);
  fillRect(ox + 26, oy + 12, 12, 6, 0x6a432a);
  fillRect(ox + 22, oy + 18, 4, 4, 0x1e1a18);
  fillRect(ox + 38, oy + 18, 4, 4, 0x1e1a18);
}

function drawSwordIcon(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillRect(ox + 30, oy + 10, 4, 34, 0xdde7f0);
  fillRect(ox + 26, oy + 20, 12, 4, 0x7d5a33);
  fillRect(ox + 29, oy + 44, 6, 10, 0x7d5a33);
  fillTriangle(ox + 32, oy + 6, ox + 28, oy + 12, ox + 36, oy + 12, 0xdde7f0);
}

function drawMapIcon(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillRect(ox + 14, oy + 14, 36, 36, 0xd2c097);
  strokeRect(ox + 14, oy + 14, 36, 36, 0x6b5235);
  strokeLine(ox + 22, oy + 18, ox + 22, oy + 46, 0x6b5235);
  strokeLine(ox + 34, oy + 18, ox + 34, oy + 46, 0x6b5235);
  drawDiamond(ox + 42, oy + 26, 6, 0xc74f3c);
}

function drawHomeIcon(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillTriangle(ox + 12, oy + 30, ox + 32, oy + 12, ox + 52, oy + 30, 0x9d4c34);
  fillRect(ox + 18, oy + 30, 28, 20, 0xc9a16b);
  strokeRect(ox + 18, oy + 30, 28, 20, 0x4a3320);
  fillRect(ox + 28, oy + 38, 8, 12, 0x71472d);
}

function drawBagIcon(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillRect(ox + 18, oy + 24, 28, 28, 0x9d6a3d);
  strokeRect(ox + 18, oy + 24, 28, 28, 0x4a3320);
  fillRect(ox + 24, oy + 18, 16, 8, 0xd7b76e);
  fillRect(ox + 28, oy + 14, 8, 6, 0x7b4e2c);
}

function drawStageNode(col, row, boss) {
  const { ox, oy } = frameOrigin(col, row);
  fillCircle(ox + 32, oy + 32, 18, boss ? 0xb93d35 : 0x4f8d4e);
  strokeCircle(ox + 32, oy + 32, 18, 0x201915);
  if (boss) {
    fillTriangle(ox + 22, oy + 24, ox + 32, oy + 12, ox + 42, oy + 24, 0xffd86c);
    fillRect(ox + 24, oy + 24, 16, 10, 0xffd86c);
  } else {
    fillCircle(ox + 32, oy + 32, 8, 0xeef7c8);
  }
}

function drawContinentBadge(col, row, unlocked) {
  const { ox, oy } = frameOrigin(col, row);
  fillCircle(ox + 32, oy + 32, 20, unlocked ? 0x4787c7 : 0x7a808a);
  strokeCircle(ox + 32, oy + 32, 20, 0x1f1a17);
  if (unlocked) {
    drawDiamond(ox + 32, oy + 32, 12, 0xd8ecff);
  } else {
    fillRect(ox + 26, oy + 26, 12, 14, 0xd7d9dd);
    fillRect(ox + 24, oy + 22, 16, 6, 0xd7d9dd);
  }
}

function drawStar(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  const points = [
    [32, 10],
    [38, 24],
    [54, 24],
    [42, 34],
    [46, 50],
    [32, 40],
    [18, 50],
    [22, 34],
    [10, 24],
    [26, 24],
  ];
  fillPolygon(
    points.map(([x, y]) => [ox + x, oy + y]),
    0xf5d25a,
  );
}

function drawButtonFrame(col, row, fill, highlight) {
  const { ox, oy } = frameOrigin(col, row);
  fillRoundedRect(ox + 4, oy + 10, 56, 44, fill);
  strokeRect(ox + 6, oy + 12, 52, 40, 0x2a2017);
  fillRect(ox + 10, oy + 16, 44, 8, highlight);
}

function drawPanelFrame(col, row) {
  const { ox, oy } = frameOrigin(col, row);
  fillRect(ox + 4, oy + 4, 56, 56, 0xe7d4ac);
  strokeRect(ox + 4, oy + 4, 56, 56, 0x5c4632);
  fillRect(ox + 10, oy + 10, 44, 6, 0xf7ecd1);
  fillRect(ox + 10, oy + 48, 44, 6, 0xd4b684);
}

function frameOrigin(col, row) {
  return { ox: col * cell, oy: row * cell };
}

function fillRect(x, y, w, h, color) {
  for (let py = y; py < y + h; py += 1) {
    for (let px = x; px < x + w; px += 1) {
      setPixel(px, py, color);
    }
  }
}

function strokeRect(x, y, w, h, color) {
  for (let px = x; px < x + w; px += 1) {
    setPixel(px, y, color);
    setPixel(px, y + h - 1, color);
  }
  for (let py = y; py < y + h; py += 1) {
    setPixel(x, py, color);
    setPixel(x + w - 1, py, color);
  }
}

function fillCircle(cx, cy, radius, color) {
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      if (x * x + y * y <= radius * radius) {
        setPixel(cx + x, cy + y, color);
      }
    }
  }
}

function strokeCircle(cx, cy, radius, color) {
  for (let angle = 0; angle < 360; angle += 1) {
    const rad = (angle * Math.PI) / 180;
    setPixel(Math.round(cx + Math.cos(rad) * radius), Math.round(cy + Math.sin(rad) * radius), color);
  }
}

function strokeLine(x1, y1, x2, y2, color) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  let x = x1;
  let y = y1;

  while (true) {
    setPixel(x, y, color);
    if (x === x2 && y === y2) {
      break;
    }
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

function fillTriangle(x1, y1, x2, y2, x3, y3, color) {
  fillPolygon(
    [
      [x1, y1],
      [x2, y2],
      [x3, y3],
    ],
    color,
  );
}

function drawDiamond(cx, cy, radius, color) {
  fillPolygon(
    [
      [cx, cy - radius],
      [cx + radius, cy],
      [cx, cy + radius],
      [cx - radius, cy],
    ],
    color,
  );
}

function fillRoundedRect(x, y, w, h, color) {
  fillRect(x + 6, y, w - 12, h, color);
  fillRect(x, y + 6, w, h - 12, color);
  fillCircle(x + 6, y + 6, 6, color);
  fillCircle(x + w - 7, y + 6, 6, color);
  fillCircle(x + 6, y + h - 7, 6, color);
  fillCircle(x + w - 7, y + h - 7, 6, color);
}

function fillPolygon(points, color) {
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const [, y] of points) {
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  for (let y = Math.floor(minY); y <= Math.ceil(maxY); y += 1) {
    const intersections = [];
    for (let i = 0; i < points.length; i += 1) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % points.length];
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
        const ratio = (y - y1) / (y2 - y1);
        intersections.push(x1 + ratio * (x2 - x1));
      }
    }
    intersections.sort((a, b) => a - b);
    for (let i = 0; i < intersections.length; i += 2) {
      const start = Math.floor(intersections[i]);
      const end = Math.ceil(intersections[i + 1] ?? intersections[i]);
      for (let x = start; x <= end; x += 1) {
        setPixel(x, y, color);
      }
    }
  }
}

function setPixel(x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return;
  }

  const offset = (y * width + x) * 4;
  bytes[offset] = (color >> 16) & 0xff;
  bytes[offset + 1] = (color >> 8) & 0xff;
  bytes[offset + 2] = color & 0xff;
  bytes[offset + 3] = 0xff;
}

function encodePng(imageWidth, imageHeight, rgbaBytes) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const scanlines = Buffer.alloc((imageWidth * 4 + 1) * imageHeight);

  for (let y = 0; y < imageHeight; y += 1) {
    const rowOffset = y * (imageWidth * 4 + 1);
    scanlines[rowOffset] = 0;
    rgbaBytes.copy(scanlines, rowOffset + 1, y * imageWidth * 4, (y + 1) * imageWidth * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(imageWidth, 0);
  ihdr.writeUInt32BE(imageHeight, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(scanlines);
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
