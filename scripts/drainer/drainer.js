const fs = require('fs');
const path = require('path');
const _url = require('url');
const http = require('http');
const https = require('https');

(async () => {
  const OUTPUT = path.resolve(__dirname, 'output');
  const FILE = await readFile(path.resolve(__dirname, 'opendata.json'));

  for await (category of FILE.categories) {
    const folder = path.resolve(OUTPUT, slugify(category.name));
    await mkdir(folder);

    for await (set of category.sets) {
      for await (dist of set.distributions) {
        let res;
        try {
          res = await httpGet(dist.url);
        } catch (e) {
          console.error(e);
          process.exit(1);
        }

        const file = path.resolve(folder, slugify(set.name) + '.' + String(dist.type).toLowerCase());

        console.log(`Creating new opendata file ${file}`);
        writeFile(file, res.toString());
      }
    }
  }
})();

// =========================================================

async function readFile(file) {
  return JSON.parse((await fs.promises.readFile(file)).toString());
}

async function writeFile(file, data) {
  return await fs.promises.writeFile(file, data);
}

async function mkdir(folder) {
  try {
    await fs.promises.mkdir(folder, { recursive: true });
  } catch (e) {
  }
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const parsed = _url.parse(url);

    const options = {
      hostname: parsed.hostname,
      path: parsed.path,
      headers: { "User-Agent": "KHK" },
    };

    const api = parsed.protocol === 'https:' ? https : http;

    api
      .get(options, res => {
        if (res.statusCode !== 200) {
          reject(`Invalid request to ${url}`);
        }

        const chunks = [];
        res.on("data", d => (chunks.push(d)));
        res.on("end", () => {
          resolve(Buffer.concat(chunks).toString('UTF-8'));
        });
      })
      .on("error", e => {
        console.error(e);
        reject(e);
      });
  });
}
