import fs from "fs";

export async function readJson(file: string): Promise<any> {
	return JSON.parse((await fs.promises.readFile(file)).toString());
}

export async function writeJson(file: string, data: any): Promise<void> {
	return await fs.promises.writeFile(file, JSON.stringify(data, null, 2));
}

export async function mkdir(folder: string): Promise<void> {
	try {
		await fs.promises.mkdir(folder, { recursive: true });
	} catch (e) {
	}
}

export function slugify(text: string): string {
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

export function parseIdentifier(str: string): string {
	return str.split('/').pop()!;
}
