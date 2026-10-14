const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'images', 'memes');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const MEMES_TO_DOWNLOAD = [
  { id: 'gigachad', name: 'Gigachad', url: 'https://i.imgflip.com/46n0h0.jpg' },
  { id: 'doge', name: 'Doge', url: 'https://i.imgflip.com/4t0m5.jpg' },
  { id: 'distracted-bf', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { id: 'drake', name: 'Drake Hotline', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { id: 'disaster-girl', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg' },
  { id: 'woman-cat', name: 'Woman Yelling At Cat', url: 'https://i.imgflip.com/345v97.jpg' },
  { id: 'roll-safe', name: 'Roll Safe (Think About It)', url: 'https://i.imgflip.com/1h7in3.jpg' },
  { id: 'two-buttons', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { id: 'mocking-spongebob', name: 'Mocking Spongebob', url: 'https://i.imgflip.com/1otk96.jpg' },
  { id: 'change-my-mind', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  { id: 'buff-doge', name: 'Buff Doge vs Cheems', url: 'https://i.imgflip.com/43a45p.png' },
  { id: 'trade-offer', name: 'Trade Offer', url: 'https://i.imgflip.com/54hjww.jpg' },
  { id: 'uno-draw-25', name: 'UNO Draw 25', url: 'https://i.imgflip.com/3lmzyx.jpg' },
  { id: 'pablo-escobar', name: 'Sad Pablo Escobar', url: 'https://i.imgflip.com/1c1uej.jpg' },
  { id: 'is-this-a-pigeon', name: 'Is This A Pigeon', url: 'https://i.imgflip.com/1o00in.jpg' },
  { id: 'epic-handshake', name: 'Epic Handshake', url: 'https://i.imgflip.com/28j0te.jpg' },
  { id: 'harold', name: 'Hide The Pain Harold', url: 'https://i.imgflip.com/gk5el.jpg' },
  { id: 'success-kid', name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg' },
  { id: 'pepe', name: 'Pepe Feels Good', url: 'https://i.imgflip.com/152t1b.jpg' },
  { id: 'always-has-been', name: 'Always Has Been', url: 'https://i.imgflip.com/46e43q.png' }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with HTTP ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Downloading ${MEMES_TO_DOWNLOAD.length} iconic meme photos to ${TARGET_DIR}...`);
  for (const meme of MEMES_TO_DOWNLOAD) {
    const ext = meme.url.endsWith('.png') ? '.png' : '.jpg';
    const filePath = path.join(TARGET_DIR, `${meme.id}${ext}`);
    try {
      await downloadFile(meme.url, filePath);
      console.log(`[OK] Saved ${meme.name} -> ${meme.id}${ext}`);
    } catch (e) {
      console.error(`[ERR] Failed ${meme.name}:`, e.message);
    }
  }
  console.log('Meme photo asset download complete!');
}

run();
