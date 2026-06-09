// Generates icon-192.png and icon-512.png using only Node.js built-ins (no external deps)
const zlib = require('node:zlib');
const fs = require('node:fs');
const path = require('node:path');

// --- CRC32 ---
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = (crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8)) >>> 0;
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const cval = crc32(Buffer.concat([t, data]));
  const c = Buffer.alloc(4); c.writeUInt32BE(cval, 0);
  return Buffer.concat([len, t, data, c]);
}

function encodePNG(w, h, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0; // filter: None
    for (let x = 0; x < w; x++) {
      const s = (y * w + x) * 4, d = y * (1 + w * 4) + 1 + x * 4;
      raw[d] = rgba[s]; raw[d+1] = rgba[s+1]; raw[d+2] = rgba[s+2]; raw[d+3] = rgba[s+3];
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', zlib.deflateSync(raw)),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Drawing ---
function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, len2 = dx*dx + dy*dy;
  const t = Math.max(0, Math.min(1, ((px-ax)*dx + (py-ay)*dy) / len2));
  return Math.hypot(px - (ax + t*dx), py - (ay + t*dy));
}

function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4);

  // Background: #6366f1
  const BG  = [0x63, 0x66, 0xf1, 255];
  const FG  = [255, 255, 255, 255];

  const radius   = size * 0.22; // rounded-corner radius
  const half     = size / 2;
  const thick    = size * 0.12; // checkmark line thickness (half)

  // Checkmark control points
  const p1 = [size * 0.20, size * 0.50];
  const p2 = [size * 0.38, size * 0.70];
  const p3 = [size * 0.76, size * 0.28];

  function blend(i, color, alpha) {
    const a = alpha * (color[3] / 255);
    pixels[i]   = Math.round(pixels[i]   * (1 - a) + color[0] * a);
    pixels[i+1] = Math.round(pixels[i+1] * (1 - a) + color[1] * a);
    pixels[i+2] = Math.round(pixels[i+2] * (1 - a) + color[2] * a);
    pixels[i+3] = Math.min(255, Math.round(pixels[i+3] + color[3] * a));
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const cx = x - half, cy = y - half;

      // --- rounded-rect distance ---
      const rx = Math.max(0, Math.abs(cx) - (half - radius));
      const ry = Math.max(0, Math.abs(cy) - (half - radius));
      const bgDist = Math.hypot(rx, ry) - radius;

      if (bgDist <= 0) {
        blend(i, BG, 1);
      } else if (bgDist < 1.5) {
        blend(i, BG, 1 - bgDist / 1.5);
      } else {
        continue; // transparent outside
      }

      // --- checkmark distance ---
      const d = Math.min(
        distToSeg(x, y, p1[0], p1[1], p2[0], p2[1]),
        distToSeg(x, y, p2[0], p2[1], p3[0], p3[1])
      );
      const half_t = thick / 2;
      if (d <= half_t) {
        blend(i, FG, 1);
      } else if (d < half_t + 1.5) {
        blend(i, FG, 1 - (d - half_t) / 1.5);
      }
    }
  }
  return encodePNG(size, size, pixels);
}

// --- Output ---
const outDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'icon-192.png'), drawIcon(192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), drawIcon(512));
console.log('Generated: public/icon-192.png, public/icon-512.png');
