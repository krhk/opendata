# Vyvtáření LKOD pro KHK

Tento dokument popisuje proces vytváření lokálního katalogu otevřených dat (LKOD) dle [posledních specifikací](https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/draft/#dcat-ap-dokumenty-katalog) a to pomocí rozhraní [DCAT-AP Dokumenty](https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/draft/#dcat-ap-dokumenty).

## 1. Vytvoření souboru katalogu

Výchozím API endpointem je `katalog`, který specifikuje entitu reprezentující datový katalog samotný a výčet jeho datových sad. Atributy jsou triviální až na položku `poskytovatel`, kde je potřeba dohleda správný identifikátor IRI pro daný kraj dle Registru práv a povinností (RPP).

Výsledkem je soubor [katalog.jsonld](src/katalog.jsonld):

```json
{
    "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/draft/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
    "iri": "https://open.datakhk.cz/katalog.jsonld",
    "typ": "Katalog",
    "název": {
        "cs": "Katalog otevřených dat Královéhradeckého kraje"
    },
    "popis": {
        "cs": "Otevřená data Kralovéhradeckého kraje. Datové sady jsou ve strojově čitelných formátech, volně přístupné k libovolným (legálním) účelům využití, bez licenčních omezení."
    },
    "poskytovatel": "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/70889546",
    "datová_sada": [
        "https://open.datakhk.cz/katalog/autobusové-zastávky-iredo/"    
    ]
}
```

Atribut `datová_sada` obsahuje pouze jednu sadu. Proces vytváření této sady je popsán níže v kapitole 2.

### 1.1. Registrace katalogu do NKOD

Vyplníme formulář na https://data.gov.cz/formulář/registrace-lokálního-katalogu a dostaneme soubor [nkod-registrace.jsonld.txt](src/nkod-registrace.jsonld.txt).

```json
{
  "@type": [
    "http://www.w3.org/ns/dcat#Catalog",
    "https://data.gov.cz/slovník/nkod/DcatApLkod"
  ],
  "http://www.w3.org/ns/dcat#endpointURL": {
    "@value": "https://open.datakhk.cz/katalog.jsonld",
    "@type": "http://www.w3.org/2001/XMLSchema#anyURI"
  },
  "http://purl.org/dc/terms/title": {
    "@language": "cs",
    "@value": "Katalog otevřených dat Královéhradeckého kraje"
  },
  "http://www.w3.org/ns/dcat#contactPoint": {
    "@type": [
      "http://www.w3.org/2006/vcard/ns#Organization"
    ],
    "http://www.w3.org/2006/vcard/ns#fn": {
      "@language": "cs",
      "@value": "Milan Šulc"
    },
    "http://www.w3.org/2006/vcard/ns#hasEmail": "spravce@datakhk.cz"
  },
  "http://xmlns.com/foaf/0.1/homepage": {
    "@id": "https://open.datakhk.cz/"
  }
}
```

Ten je potřeba zaslat na datovou schránku dle instrukcí.

> Registrační záznam katalogu stáhněte a zašlete jej jako jedinou přílohu datové zprávy s příponou ".txt" a předmětem "NKOD" do datové schránky m3hp53v.


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

Data jsou čistá. Problém je pouze s kódováním, které není UTF-8 ale CP-1250. Náselduje analýza jednotlivých sloupců.

**WKT - formát zápisu vektorové geometrie**

První slopec obsahuje geosouřadnice zastávky. Dobrá zpráva je, že jsou ve formátu Well-Known Text (WKT), který je standardem dle doporučení [Prosotorová data](https://ofn.gov.cz/prostorov%C3%A1-data/2019-08-22/#standardy-wkt). Z popisu datové sady se dozvíme, že je použit souřadnicový systém World Geodetic System 1984 (WGS 84), který je rovněž [podporován OFN](https://ofn.gov.cz/prostorov%C3%A1-data/2019-08-22/#sou%C5%99adnicov%C3%A9-referen%C4%8Dn%C3%AD-syst%C3%A9my-wgs84) a je i referenčním systémem dle [specifikace GeoJSON](https://tools.ietf.org/html/rfc7946#section-4).

**OBJECTID - identifikátor záznamu**

Jedná se o umělý unikátní číselný identifikátor označníku zastávky.

**CRZ - číslo centrálního registru zastávek**

Číselný identifikátor zastávky bez rozlišení směru (označníku). CRZ jsem v NKOD nenašel, jinak by bylo asi vhodné použít referenci.

**OZNACNIK1, OZNACNIK2 - číslo označníku (2místné číslo)**

Dva číselné sloupce, které pomáhají identifikovat označník v rámci dané zastávky. Hodnota sloupce OZNACNIK1 je v několika málo případech prázdná.

**CRZ_OZNACN - jedinečný identifikátor označníku skládající se z kombinace CRZ + OZNACNIK2, poslední dvojčíslí vždy značí číslo označníku příslušející k dané zastávce**

Unikátní číselný identikátor označníku, nyní dle CRZ.

**TARIF_NAZE - tarifní název zastávky v syntaxi používané systémem IREDO**

Lidsky čitelný název zastávky. Označníky každé zastávky nesou typicky stejný název.

### 2.2. Vytvoření CSVW schema

Dle doporučení vytvoříme [CSVW schema](https://www.w3.org/TR/tabular-data-primer/), které je popisuje jednotlivé sloupce v CSV. Výsledkem je soubor [autobusové-zastávky-iredo.csv-metadata.json](src/katalog/autobusové-zastávky-iredo/autobusové-zastávky-iredo.csv-metadata.json).

### 2.3. Vytvoření souboru s metadaty datové sady v JSON-LD

Nyní je potřeba popsat datovou sadu metadatovým souborem, kterému bude rozumět NKOD. Použijeme [formulář pro vytvoření datové sady](https://dev.nkod.opendata.cz/formulář/registrace-datové-sady) a na konci soubor stáhneme (dev verze podporuje všechny nezbytné atributy). Na konci zvolíme způsob stažení LKOD a výsledkem je JSON-LD soubor [autobusové-zastávky-iredo.jsonld](src/katalog/autobusové-zastávky-iredo/index.jsonld).
