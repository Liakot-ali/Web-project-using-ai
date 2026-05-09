const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const outDir = path.join(process.cwd(), 'assets', 'images');
fs.mkdirSync(outDir, { recursive: true });

const urls = [
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524758631624-3f1f1e6a6b6b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533777324565-a040eb52fac2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552905858-50f8a1b6b9f5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603898037225-1b2a3a1b3bb3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621368536039-7b7d4f4f7a29?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155222e6f6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=800&auto=format&fit=crop'
];

function filenameForUrl(u) {
  try {
    const parsed = new URL(u);
    const base = path.basename(parsed.pathname);
    const hash = crypto.createHash('md5').update(u).digest('hex').slice(0,8);
    const ext = path.extname(base) || '.jpg';
    const name = (base.replace(/[^a-z0-9\-_.]/ig, '') || 'img') + '-' + hash + ext;
    return name;
  } catch (e) {
    const hash = crypto.createHash('md5').update(u).digest('hex').slice(0,8);
    return 'img-' + hash + '.jpg';
  }
}

async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status} ${res.statusText}`);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(buf));
}

(async () => {
  const map = {};
  for (const u of urls) {
    try {
      const name = filenameForUrl(u);
      const outPath = path.join(outDir, name);
      process.stdout.write(`Downloading ${u} -> ${path.relative(process.cwd(), outPath)}... `);
      await download(u, outPath);
      console.log('done');
      map[u] = path.posix.join('assets', 'images', name);
    } catch (e) {
      console.log('failed:', e.message);
    }
  }
  fs.writeFileSync(path.join(process.cwd(), 'reports', 'image-map.json'), JSON.stringify(map, null, 2));
  console.log('Saved image map to reports/image-map.json');
})();
