import _url from 'url';
import * as CONFIG from '@/config';
import { httpGet } from '@/http';
import { writeJson } from '@/helpers';

async function downloadArcgis(): Promise<any> {
	const res = await httpGet(CONFIG.ARCGIS_URL);
	return JSON.parse(res);
}

async function syncArcgis(): Promise<any> {
	const arcgis = await downloadArcgis();
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
