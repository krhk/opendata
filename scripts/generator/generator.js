const fs = require('fs');
const path = require('path');
const _url = require('url');
const http = require('http');
const https = require('https');

const URL = `https://open.datakhk.cz`;

(async () => {
  const OUTPUT = path.resolve(__dirname, 'output');
  const FILE = await readFile(path.resolve(__dirname, 'opendata.json'));

  // Collection of datasets
  const datasets = [];

  for await (category of FILE.categories) {
    const folder = path.resolve(OUTPUT, slugify(category.name));
    await mkdir(folder);

    for await (set of category.sets) {

      // Collection of distributions
      const dists = [];
      for await (dist of set.distributions) {
        // Distribution vars
        const file = path.resolve(folder, slugify(set.name) + '.' + String(dist.type).toLowerCase());
        const fileBase = path.basename(file);
        const metadataFile = file + '-metadata.json';
        const metadataFileBase = path.basename(metadataFile);
        const ctx = {
          title: set.name,
          description: set.name,
          type: dist.type,
          file: fileBase,
          metadataFile: metadataFileBase,
        };

        // Download file
        console.log(`Downloading dist data file ${dist.url}`);
        const res = await httpGet(dist.url);

        // Save downloaded file
        console.log(`Writing dist data file ${file}`);
        writeFile(file, res.toString());

        // Generate metadata file
        console.log(`Writing dist metadata file ${metadataFile}`);
        writeFile(metadataFile, JSON.stringify(await generateDist(ctx), null, 2));

        // Append to dists
        dists.push(ctx);
      }

      // Set vars
      const file = path.resolve(folder, slugify(set.name) + '.jsonld');

      // Generate metadata file
      console.log(`Writing set metadata file ${file}`);
      const setCtx = {
        name: set.name,
        category: category.name,
        categorySlug: slugify(category.name),
        dists,
      };
      writeFile(file, JSON.stringify(await generateSet(setCtx), null, 2));

      // Append to sets
      datasets.push({
        file: path.relative(OUTPUT, file),
      });
    }
  }

  const file = path.join(OUTPUT, 'katalog.jsonld');

  // Generate catalogue file
  console.log(`Writing catalogue file ${file}`);
  const catCtx = {
    datasets: datasets.sort((a, b) => a.file.localeCompare(b.file))
  };
  writeFile(file, JSON.stringify(await generateCatalogue(catCtx), null, 2));

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

function generateUrl(parts) {
  return [URL, ...parts].join('/');
}

async function generateDist(ctx) {
  const dist = {
    "@context": [
      "http://www.w3.org/ns/csvw",
      {
        "@language": "cs"
      }
    ],
    "url": ctx.file,
    "dc:title": ctx.title,
    "dc:description": ctx.description,
    "tableSchema": {},
  };

  return dist;
}

async function generateSet(ctx) {
  const set = {
    "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    "iri": "https://open.datakhk.cz/katalog/autobusové-zastávky-iredo/",
    "typ": "Datová sada",
    "název": {
      "cs": ctx.name,
      // "en": "todo"
    },
    "popis": {
      "cs": ctx.name,
      // "en": "todo"
    },
    "prvek_rúian": [
      "https://linked.cuzk.cz/resource/ruian/vusc/86"
    ],
    "geografické_území": [],
    "prostorové_pokrytí": [],
    "klíčové_slovo": {
      "cs": [],
      "en": [],
    },
    "periodicita_aktualizace": "http://publications.europa.eu/resource/authority/frequency/ANNUALY",
    "téma": [
      "http://publications.europa.eu/resource/authority/data-theme/REGI"
    ],
    "koncept_euroVoc": [
      "http://eurovoc.europa.eu/4197"
    ],
    "kontaktní_bod": {},
    "poskytovatel": "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/70889546",
    "distribuce": []
  }

  let counter = 1;
  for await (const dist of ctx.dists) {
    const categorySlug = ctx.categorySlug.toLowerCase();
    const file = dist.file;
    const metadataFile = dist.metadataFile;
    const ext = dist.type;

    set['distribuce'].push({
      "typ": "Distribuce",
      "iri": generateUrl([categorySlug, 'distribuce', counter++]),
      "soubor_ke_stažení": generateUrl([categorySlug, file]),
      "přístupové_url": generateUrl([categorySlug, file]),
      "typ_média": `http://www.iana.org/assignments/media-types/text/csv/${ext.toLowerCase()}`,
      "formát": `http://publications.europa.eu/resource/authority/file-type/${ext.toUpperCase()}`,
      "schéma": generateUrl([categorySlug, metadataFile]),
      "podmínky_užití": {
        "typ": "Specifikace podmínek užití",
        "autorské_dílo": "https://data.gov.cz/podmínky-užití/neobsahuje-autorská-díla/",
        "databáze_jako_autorské_dílo": "https://data.gov.cz/podmínky-užití/není-autorskoprávně-chráněnou-databází/",
        "databáze_chráněná_zvláštními_právy": "https://data.gov.cz/podmínky-užití/není-chráněna-zvláštním-právem-pořizovatele-databáze/",
        "osobní_údaje": "https://data.gov.cz/podmínky-užití/neobsahuje-osobní-údaje/"
      }
    });
  }

  return set;
}

function generateCatalogue(ctx) {
  const catalogue = {
    "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    "iri": "https://open.datakhk.cz/katalog.jsonld",
    "typ": "Katalog",
    "název": {
      "cs": "Katalog otevřených dat Královéhradeckého kraje"
    },
    "popis": {
      "cs": "Otevřená data Kralovéhradeckého kraje. Datové sady jsou ve strojově čitelných formátech, volně přístupné k libovolným (legálním) účelům využití, bez licenčních omezení."
    },
    "poskytovatel": "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/70889546",
    "datová_sada": ctx.datasets.map(set => generateUrl([set.file])),
  }

  return catalogue;
}
