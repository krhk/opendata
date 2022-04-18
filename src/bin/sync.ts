import _url from 'url';
import _ from "lodash";
import { httpGet } from '@/http';
import { parseIdentifier, writeJson } from '@/helpers';
import * as CONFIG from '@/../config';

async function downloadArcgis(): Promise<any> {
	const res = await httpGet(CONFIG.ARCGIS_URL);
	return JSON.parse(res);
}

async function syncArcgis(): Promise<any> {
	const arcgis = await downloadArcgis();

	// Format datasets
	arcgis.dataset = _(arcgis.dataset)
		// Filter out excluded datasets
		.filter((dataset: any) => !CONFIG.META_LKOD.excludedDatasets.includes(parseIdentifier(dataset.identifier)))
		// Order by ID (to prevent git changes)
		.orderBy('identifier')
		.value();

	await writeJson(CONFIG.ARCGIS_FILE, arcgis);
}

(async () => {
	try {
		console.log(`Syncing ${CONFIG.ARCGIS_URL}`);
		await syncArcgis();
	} catch (e) {
		console.error(e);
	}
})();
