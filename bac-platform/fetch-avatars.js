const fs = require('fs');
const https = require('https');
const path = require('path');

const channels = [
  { id: 'Saidani-Philo', url: 'https://www.youtube.com/@Saidani-Philo' },
  { id: 'Prof-3lilou', url: 'https://www.youtube.com/@prof_3lilo_10' },
  { id: 'Wissal', url: 'https://www.youtube.com/@WissalOulem' },
  { id: 'Bac-19', url: 'https://www.youtube.com/@Bacwith19' }
];

const avatarsDir = path.join(__dirname, 'public', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

async function downloadAvatar(channel) {
  try {
    const html = await new Promise((resolve, reject) => {
      https.get(channel.url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });

    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (match && match[1]) {
      let imageUrl = match[1];
      const filePath = path.join(avatarsDir, `${channel.id}.jpg`);
      
      await new Promise((resolve, reject) => {
        https.get(imageUrl, (res) => {
          const fileStream = fs.createWriteStream(filePath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Saved ${channel.id}.jpg`);
            resolve();
          });
        }).on('error', reject);
      });
    } else {
      console.log(`Avatar not found for ${channel.id}`);
    }
  } catch (error) {
    console.log(`Failed to fetch ${channel.id}:`, error.message);
  }
}

async function main() {
  for (const channel of channels) {
    await downloadAvatar(channel);
  }
  console.log('Done!');
}

main();
