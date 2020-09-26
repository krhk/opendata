# Vytvoření souboru katalogu

Výchozím API endpointem je `katalog`, který specifikuje entitu reprezentující datový katalog samotný a výčet jeho datových sad. Atributy jsou triviální až na položku `poskytovatel`, kde je potřeba dohleda správný identifikátor IRI pro daný kraj dle Registru práv a povinností (RPP).

Výsledkem je soubor [katalog.jsonld](../src/katalog.jsonld):

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

Atribut `datová_sada` obsahuje pouze jednu sadu. Proces vytváření této sady je popsán v dokumentu [tutorial-zastavky.md](tutorial-zastavky.md).

### Registrace katalogu do NKOD

Vyplníme formulář na https://data.gov.cz/formulář/registrace-lokálního-katalogu a dostaneme soubor [nkod-registrace.jsonld.txt](../src/nkod-registrace.jsonld.txt).

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
