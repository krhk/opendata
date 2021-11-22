import _url from 'url';
import _ from "lodash";
import { httpGet } from '@/http';
import { writeJson } from '@/helpers';
import * as CONFIG from '@/../config';

async function downloadArcgis(): Promise<any> {
	const res = await httpGet(CONFIG.ARCGIS_URL);
	return JSON.parse(res);
}

async function syncArcgis(): Promise<any> {
	const arcgis = await downloadArcgis();

	// Order datasets
	arcgis.dataset = _.orderBy(arcgis.dataset, 'identifier');

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
