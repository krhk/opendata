import * as CONFIG from "../config.ts";

export function generateUrl(...parts: string[]): string {
	return [CONFIG.LKOD_URL, ...parts].join("/");
}
