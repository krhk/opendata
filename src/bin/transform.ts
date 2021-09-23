import { readJson, parseIdentifier, writeJson } from '@/helpers';
import { detectMediaType } from '@/mapper';
import _url from 'url';
import * as CONFIG from '../config';
import { generateUrl } from '../generator';

(async () => {
	const arcgis: Arcgis.Catalogue = await readJson(CONFIG.ARCGIS_FILE);
	const dto: Partial<Transfer.Root> = {};

	// Catalogue
	dto["@context"] = "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld";
	dto['iri'] = generateUrl('katalog.jsonld');
	dto['typ'] = "Katalog";
	dto['domovská_stránka'] = CONFIG.META_LKOD.homepage;
	dto['název'] = {
		"cs": CONFIG.META_LKOD.name_cz
	};
	dto['popis'] = {
		"cs": CONFIG.META_LKOD.description_cz
	};
	dto['poskytovatel'] = CONFIG.META_LKOD.provider;
	dto['kontaktní_bod'] = {
		typ: CONFIG.META_LKOD.contact_type,
		jméno: {
			cs: CONFIG.META_LKOD.contact_name,
		},
		"e-mail": `mailto:${CONFIG.META_LKOD.contact_email}`,
	}
	dto['datová_sada'] = [];
	dto['_datasets'] = [];

	// Datasets
	for await (const arcgisDataset of arcgis.dataset) {
		const dataset: Partial<Lkod.Dataset> = {};

		const id = parseIdentifier(arcgisDataset.identifier);
		dataset['@context'] = 'https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld';
		dataset['iri'] = generateUrl(`${id}.jsonld`);
		dataset['typ'] = 'Datová sada';
		dataset['název'] = {
			cs: arcgisDataset.title
		};
		dataset['popis'] = {
			cs: arcgisDataset.description
		};
		dataset['klíčové_slovo'] = {
			cs: arcgisDataset.keyword,
		}
		dataset['téma'] = ['http://publications.europa.eu/resource/authority/data-theme']; // @todo
		dataset['periodicita_aktualizace'] = 'http://publications.europa.eu/resource/authority/frequency/ANNUALY'; // @todo
		dataset['prvek_rúian'] = [
			"https://linked.cuzk.cz/resource/ruian/vusc/86"
		];
		dataset['distribuce'] = [];

		// Distributions
		for await (const arcgisDistribution of arcgisDataset.distribution) {
			const distribution: Partial<Lkod.DatasetDistribution> = {};
			const mediaType = detectMediaType(arcgisDistribution.mediaType);

			distribution['typ'] = 'Distribuce';
			distribution['iri'] = arcgisDistribution.accessURL;
			distribution['název'] = {
				cs: arcgisDistribution.title
			}
			distribution['soubor_ke_stažení'] = arcgisDistribution.accessURL;
			distribution['přístupové_url'] = arcgisDistribution.accessURL;
			distribution['typ_média'] = `http://www.iana.org/assignments/media-types/${mediaType.mediaType}`;
			distribution['formát'] = `http://publications.europa.eu/resource/authority/file-type/${mediaType.fileType}`;
			distribution['podmínky_užití'] = {
				typ: "Specifikace podmínek užití",
				autorské_dílo: "https://data.gov.cz/podmínky-užití/neobsahuje-autorská-díla/",
				databáze_jako_autorské_dílo: "https://data.gov.cz/podmínky-užití/není-autorskoprávně-chráněnou-databází/",
				databáze_chráněná_zvláštními_právy: "https://data.gov.cz/podmínky-užití/není-chráněna-zvláštním-právem-pořizovatele-databáze/",
				osobní_údaje: "https://data.gov.cz/podmínky-užití/neobsahuje-osobní-údaje/"
			};

			dataset['distribuce'].push(distribution as Lkod.DatasetDistribution);
		}

		dto['_datasets'].push(dataset as Lkod.Dataset);
		dto['datová_sada'].push(dataset.iri);
	}

	// Store DTO
	writeJson(CONFIG.DTO_FILE, dto);
})();