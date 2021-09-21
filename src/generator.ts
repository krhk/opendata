import * as CONFIG from "./config";

export function generateUrl(...parts: string[]): string {
	return [CONFIG.LKOD_URL, ...parts].join('/');
}
