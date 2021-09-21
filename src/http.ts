import http from 'http';
import https from 'https';
import _url from 'url';

export function httpGet(url: string): Promise<any> {
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

				const chunks: any = [];
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
