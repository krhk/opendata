# Vyvtáření LKOD pro KHK

Tento dokument popisuje proces vytváření lokálního katalogu otevřených dat (LKOD) dle [posledních specifikací](https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/draft/#dcat-ap-dokumenty-katalog) a to pomocí statických souborů ve formátu [`JSON-LD`](https://ofn.gov.cz/propojen%C3%A1-data/draft/#serializace-JSON-LD). 



## 1. Vytvoření souboru katalogu

Výchozím API endpointem je `katalog`, který specifikuje entitu reprezentující datový katalog samotný a výčet jeho datových sad.

Atributy jsou triviální až na položku `poskytovatel`, kde je potřeba dohleda správný identifikátor IRI pro daný kraj dle Registru práv a povinností (RPP). 

> Nenašel jsem lepší způsob, než stáhnout číselník [Orgánů veřejné moci (OVM)](https://data.gov.cz/zdroj/datov%C3%A9-sady/MV/706529437/44a9d6abacd4d0e83a0694e74d028f51) (CSV 33 MB), v něm najít ID kraje a to dosadit do IRI z [příkladu](https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/draft/#example-3-vzorovy-soubor-katalogu-se-tremi-datovymi-sadami-ve-formatu-json-ld). Výsledkem je IRI poskytovatele `https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/70889546` vedoucí na LodView (pozn. Proč? Nemělo by to vést přímo na API číselníku?).

> Pro znalé SPARQL lze vylistovat všechny orgány veřejné moci (jejich jména a IRI) pomocí:
    ```
    select * WHERE {
      ?x <https://slovník.gov.cz/legislativní/sbírka/111/2009/pojem/má-název-orgánu-veřejné-moci> ?y
    }
    ```
    na endpointu `https://rpp-opendata.egon.gov.cz/odrpp/sparql` (pozn. Proč to nefunguje taky na `data.gov.cz/sparql`?).

Výsledný soubor vypadá takto (bez lokalizovaných popisků):

```json
{
    "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    "iri": "https://data.kr-kralovehradecky.cz/katalog",
    "typ": "Katalog",
    "název": {
        "cs": "Katalog otevřených dat Královéhradeckého kraje"
    },
    "popis": {
        "cs": "Otevřená data Kralovéhradeckého kraje. Datové sady jsou ve strojově čitelných formátech, volně přístupné k libovolným (legálním) účelům využití, bez licenčních omezení."
    },
    "poskytovatel": "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/70889546",
    "datová_sada": []
}
```

Atribut `datová_sada` nyní obsahuje prázdný seznam datových sad (jejich IRI), takže rovnou jednu vytvoříme.




## 2. Vytvoření souboru datové sady

Vytvoříme datovou sadu pro již existující tabulku ["Seznam autobusových zastávek IREDO v kraji"](http://www.kr-kralovehradecky.cz/cz/kraj-volene-organy/sklad/opendata/doprava/doprava-113947/). 

Úryvek z CSV tabulky:

```csv
WKT,OBJECTID,CRZ,OZNACNIK1,OZNACNIK2,CRZ_OZNACN,"TARIF_NAZE,C,250"
POINT (16.0615506894965 50.1443117185118),1,59,1,1,5901,Albrechtice n.Orl.-nákupní støedisko
POINT (16.0618313476414 50.1442223310093),2,59,2,2,5902,Albrechtice n.Orl.-nákupní støedisko
POINT (16.0397611171673 50.1380047673676),3,60,1,1,6001,Albrechtice n.Orl.-odb.Vys.Chvojno
POINT (16.0398469599364 50.1380355883093),4,60,2,2,6002,Albrechtice n.Orl.-odb.Vys.Chvojno
POINT (16.0633678107035 50.1400207746239),5,61,1,1,6101,Albrechtice n.Orl.-pošta
```

### 2.1. Analýza dat

Data jsou čistá. Problém je pouze s kódováním, které není UTF-8 ale CP-1250. Toto bude nutné zohlednit při konverzi souboru z CSV do JSON-LD. Náselduje analýza jednotlivých sloupců.

**WKT - formát zápisu vektorové geometrie**

První slopec obsahuje geosouřadnice zastávky. Dobrá zpráva je, že jsou ve formátu Well-Known Text (WKT), který je standardem dle doporučení [Prosotorová data](https://ofn.gov.cz/prostorov%C3%A1-data/2019-08-22/#standardy-wkt). Z popisu datové sady se dozvíme, že je použit souřadnicový systém World Geodetic System 1984 (WGS 84), který je rovněž [podporován OFN](https://ofn.gov.cz/prostorov%C3%A1-data/2019-08-22/#sou%C5%99adnicov%C3%A9-referen%C4%8Dn%C3%AD-syst%C3%A9my-wgs84) a je i referenčním systémem dle [specifikace GeoJSON](https://tools.ietf.org/html/rfc7946#section-4).

**OBJECTID - identifikátor záznamu**

Jedná se o umělý unikátní číselný identifikátor označníku zastávky.

**CRZ - číslo centrálního registru zastávek**

Číselný identifikátor zastávky bez rozlišení směru (označníku). CRZ jsem v NKOD nenašel, jinak by bylo asi vhodné použít referenci.

**OZNACNIK1, OZNACNIK2 - číslo označníku (2místné číslo)**

Dva číselné sloupce, které pomáhají identifikovat označník v rámci dané zastávky.

**CRZ_OZNACN - jedinečný identifikátor označníku skládající se z kombinace CRZ + OZNACNIK2, poslední dvojčíslí vždy značí číslo označníku příslušející k dané zastávce**

Unikátní číselný identikátor označníku, nyní dle CRZ.

**TARIF_NAZE - tarifní název zastávky v syntaxi používané systémem IREDO**

Lidsky čitelný název zastávky. Označníky každé zastávky nesou typicky stejný název.

### 2.2. Mapování dat

Nyní je potřeba vyřešit obohacení surových dat o metadata. Mezi [existujícimi OFN](https://opendata.gov.cz/otev%C5%99en%C3%A9-form%C3%A1ln%C3%AD-normy:start#ofn_pro_konkr%C3%A9tn%C3%AD_datov%C3%A9_sady) jsem nenašel vhodnou sadu, bude tedy potřeba definovat nový model. Použiju však některé existujicí specifikace pro [sdílené datové typy](https://opendata.gov.cz/otev%C5%99en%C3%A9-form%C3%A1ln%C3%AD-normy:start#specifikace_pro_nej%C4%8Dast%C4%9Bji_se_vyskytuj%C3%ADc%C3%AD_%C4%8D%C3%A1sti_dat), konkrétně `Umístění`. Zbylé atributy budou modelovány pomocí specifikace [Základních datových typů](https://ofn.gov.cz/základní-datové-typy/draft/).
 
**Kontejner pro zastávky**

Nejprve je potřeba definovat uzel seznamu zastávek. Existující dokumenty NKOD k tomu běžně používají uzel `položky` typu `@graph`.

**Uzel zastávka**

Přimo zástávku jsem nenašel mezi [dostupnými OFN](https://opendata.gov.cz/otev%C5%99en%C3%A9-form%C3%A1ln%C3%AD-normy:start#ofn_pro_konkr%C3%A9tn%C3%AD_datov%C3%A9_sady) ani ve [slovníku pojmů](https://slovnik.gov.cz/prohlížeč). Slovník Schema.org sice definuje pojem `https://schema.org/BusStop`, jeho atributy ale nejsou kompatibilní s doporučeními OFN. Z těch obecných zastávku nejlépe popisuje `Umístění`. Založím tedy nový uzel `zastávka` typu `https://ofn.gov.cz/umístění/`.

> Je zde potřeba definovat nový typ pod vlastním slovníkem - např. `https://data.kr-kralovehradecky.cz/zastávka/`?

**ID zastávky**

Jednoznačný identifikátor ve světě otevřených dat je IRI. Použiju tedy vlastnost `@id` a její hodnotu vytvořím pomocí kombinace namespace `https://data.kr-kralovehradecky.cz/zastávka/` a hodnoty ve sloupci `OBJECTID`. Např. `"@id": "https://data.kr-kralovehradecky.cz/zastávka/123"`.

> Je potřeba implementovat dereferencování této IRI?  

**WKT**

Sloupec WKT definuji jako bod `geometrie` (vlastnost `Umístění`) se souřadnicemi. Např. `"geometrie": { "type": "Point", "coordinates": [16.0615506894965, 50.1443117185118] }`.

>  Lze specifikovat souř. systém v JSON-LD?

**OBJECTID, CRZ, OZNACNIK1, OZNACNIK2 a CRZ_OZNACN**

Použiju typ `xsd:integer` z jazyka XML Schema. Např. `"crz": 123`.

**TARIF_NAZE**

Pro název zastávky použiju vlastnost `název` z třídy `Umístění`. Podpora lokalizace zde asi nemá smysl. Např. `"název": "Albrechtice n.Orl.-nákupní středisko"`. 

Výsledný JSON-LD soubor vypadá takto (pro 1 zastávku):

```json
{
  "@context": {
    "@base": "https://data.kr-kralovehradecky.cz/",
    "type": "@type",
    "id": "@id",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "geojson": "https://purl.org/geojson/vocab#",
    "položky": "@graph",
    "zastávka": "https://ofn.gov.cz/umístění/",
    "geometrie": "geojson:geometry",
    "objectId": "xsd:integer",
    "crz": "xsd:integer",
    "oznacnik1": "xsd:integer",
    "oznacnik2": "xsd:integer",
    "crzOznacnik": "xsd:integer"
  },
  "položky": [
    {
      "type": "zastávka",
      "id": "zastávka/1",
      "geometrie": { "geojson:type": "Point", "geojson:coordinates": [16.0615506894965, 50.1443117185118] },
      "objectId": 1,
      "crz": 59,
      "oznacnik1": 1,
      "oznacnik2": 1,
      "crzOznacnik": 5901,
      "název": "Albrechtice n.Orl.-nákupní středisko"
    },
    {
      "type": "zastávka",
      "id": "zastávka/2",
      "geometrie": { "geojson:type": "Point", "geojson:coordinates": [16.0618313476414, 50.1442223310093] },
      "objectId": 2,
      "crz": 59,
      "oznacnik1": 2,
      "oznacnik2": 2,
      "crzOznacnik": 5902,
      "název": "Albrechtice n.Orl.-nákupní středisko"
    }
  ]
}
```

Pro úplnost dodávám, že jsem zvolil (zatím neexistující) namespace `https://data.kr-kralovehradecky.cz/` a ačkoliv to není potřeba, držel jsem se stejného formátu jako v publikacích MVCR a definoval jsem aliasy pro `@type` a `@id`.    
