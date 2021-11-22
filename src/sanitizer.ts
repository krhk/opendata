import striptags from "striptags";

export function sanitizeText(str: string): string {
	return striptags(str);
}
