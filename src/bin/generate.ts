import _url from "url";
import fs from "fs";
import path from "path";
import _ from "lodash";
import { parseIdentifier, readJson, writeJson } from "../helpers.ts";
import * as CONFIG from "../../config.ts";

(async () => {
	const dto: Transfer.Root = await readJson(CONFIG.DTO_FILE);

	try {
		await fs.promises.mkdir(CONFIG.LKOD_DIR);
	} catch {}

	// Catalogue
	const lkod: Lkod.Catalogue = _.omit(dto, ["_datasets"]);
	await writeJson(CONFIG.LKOD_FILE, lkod);

	// Datasets
	for await (const dataset of dto._datasets) {
		const id = parseIdentifier(dataset.iri);
		await writeJson(path.join(CONFIG.LKOD_DIR, id), dataset);
	}
})();
