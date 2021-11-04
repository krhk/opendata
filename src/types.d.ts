declare module Arcgis {

	interface Catalogue {
		'@context': string,
		'@type': string,
		conformsTo: string,
		describedBy: string,
		dataset: Dataset[],
	}

	interface Publisher {
		name: string,
	}

	interface ContactPoint {
		'@type': string,
		fn: string,
	}

	interface Distribution {
		'@type': string,
		title: string,
		format: string,
		mediaType: string,
		accessURL: string,
	}

	interface Dataset {
		'@type': string,
		identifier: string,
		license?: any,
		landingPage: string,
		title: string,
		description: string,
		keyword: string[],
		issued: Date,
		modified: Date,
		publisher: Publisher,
		contactPoint: ContactPoint,
		accessLevel: string,
		distribution: Distribution[],
		spatial: string,
		theme: string[],
	}

}

declare module Transfer {

	interface Root extends Lkod.Catalogue {
		_datasets: Lkod.Dataset[],
	}

}

declare module Lkod {

	interface Catalogue {
		'@context': string,
		iri: string,
		typ: string,
		název: MultilangText,
		popis: MultilangText,
		poskytovatel: string,
		kontaktní_bod: Contact,
		domovská_stránka: string,
		datová_sada: string[],
	}

	interface Dataset {
		'@context': string,
		iri: string,
		typ: string,
		název: MultilangText,
		popis: MultilangText,
		prvek_rúian: string[],
		geografické_území: any[],
		prostorové_pokrytí: any[],
		klíčové_slovo: MultilangTexts,
		periodicita_aktualizace: string,
		téma: string[],
		koncept_euroVoc: string[],
		kontaktní_bod: DatasetContactPoint,
		poskytovatel: string,
		distribuce: DatasetDistribution[],
	}

	interface DatasetContactPoint {
	}

	interface DatasetConditions {
		typ: string,
		autorské_dílo: string,
		databáze_jako_autorské_dílo: string,
		databáze_chráněná_zvláštními_právy: string,
		osobní_údaje: string,
	}

	interface DatasetDistribution {
		typ: string,
		iri: string,
		název: MultilangText,
		soubor_ke_stažení: string,
		přístupové_url: string,
		typ_média: string,
		formát: string,
		schéma: string,
		podmínky_užití: DatasetConditions,
		dokumentace: URL,
	}

	interface Contact {
		typ: string,
		jméno: MultilangText,
		'e-mail': string,
	}

	interface MultilangText {
		cs: string,
		en?: string,
	}

	interface MultilangTexts {
		cs: string[],
		en?: string[],
	}

	interface URL {
		stránka: string,
	}

}

declare module Lib {
	interface MediaType {
		fileType: string,
		mediaType: string
	}
}
