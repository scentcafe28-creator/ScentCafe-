import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function createPng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with scanline filter byte 0
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = Math.min(width, height) * (isMaskable ? 0.38 : 0.44);
  const innerR = outerR * 0.55;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background: #0B132B (Navy / Dark Slate)
      let r = 11;
      let g = 19;
      let b = 43;
      let a = 255;

      // Subtle gradient from top to bottom
      const gradRatio = y / height;
      r = Math.min(255, Math.floor(14 - gradRatio * 8));
      g = Math.min(255, Math.floor(25 - gradRatio * 14));
      b = Math.min(255, Math.floor(55 - gradRatio * 30));

      // Gold bottle / emblem in center
      if (dist < outerR && dist >= outerR - Math.max(2, width * 0.025)) {
        // Outer gold border ring
        r = 212; // #D4AF37
        g = 175;
        b = 55;
      } else if (dist < outerR - 4 && dist >= outerR - Math.max(6, width * 0.04)) {
        // Soft aura
        r = Math.floor(r * 0.5 + 212 * 0.5);
        g = Math.floor(g * 0.5 + 175 * 0.5);
        b = Math.floor(b * 0.5 + 55 * 0.5);
      }

      // Perfume bottle silhouette inside
      const nx = dx / outerR;
      const ny = dy / outerR;

      // Bottle cap
      if (Math.abs(nx) < 0.22 && ny > -0.75 && ny < -0.55) {
        r = 245; // #F5D061
        g = 208;
        b = 97;
      }
      // Bottle neck
      if (Math.abs(nx) < 0.12 && ny >= -0.55 && ny < -0.42) {
        r = 212;
        g = 175;
        b = 55;
      }
      // Bottle body
      if (Math.abs(nx) < 0.52 && ny >= -0.42 && ny < 0.58) {
        // Bottle glass background
        r = 20;
        g = 30;
        b = 60;

        // Bottle outer stroke
        if (Math.abs(nx) > 0.46 || ny > 0.52 || (ny < -0.36 && Math.abs(nx) > 0.3)) {
          r = 212;
          g = 175;
          b = 55;
        }

        // Golden essence teardrop center
        const dropY = ny - 0.12;
        const dropDist = Math.sqrt(nx * nx * 2.2 + dropY * dropY);
        if (dropDist < 0.28) {
          r = 245;
          g = 208;
          b = 97;
        }
      }

      // Sparkle
      if (Math.abs(nx - 0.55) < 0.08 && Math.abs(ny + 0.45) < 0.08) {
        r = 255;
        g = 245;
        b = 180;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', deflated);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate 192x192
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPng(192, 192, false));
console.log('Created pwa-192x192.png');

// Generate 512x512
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPng(512, 512, false));
console.log('Created pwa-512x512.png');

// Generate maskable 512x512 (with safe zone margins)
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
console.log('Created pwa-maskable-512x512.png');

// Generate apple-touch-icon 180x180
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180, false));
console.log('Created apple-touch-icon.png');
