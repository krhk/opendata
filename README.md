# Opendata Královéhradeckého kraje

- Web: https://datakhk.cz
- Katalog: https://open.datakhk.cz/katalog.jsonld
- NKOD: https://data.gov.cz/datov%C3%A9-sady
- NKOD (Královéhradecký kraj): https://data.gov.cz/datov%C3%A9-sady?poskytovatel=https%3A%2F%2Frpp-opendata.egon.gov.cz%2Fodrpp%2Fzdroj%2Forg%C3%A1n-ve%C5%99ejn%C3%A9-moci%2F70889546

## Development

**Tech stack**

- Node.js
- JavaScript
- TypeScript
- ECMAScript (https://github.com/standard-things/esm)

**Workflow**

- Source code on Github (https://github.com)
- Deployments on Vercel (https://vercel.com)

**Guidelines**

- Install dependencies via `make install`
- Build LKOD via `make build`
  - Download data from ArcGIS Hub via `make sync`
  - Transfer ArcGIS Hub data to NKOD data via `make transform`
  - Create LKOD via `make generata`

## Configuration

There is a file called `config.ts` in root of this project. Take a look and edit whatever you want.

## Documentation

### Registration to NKOD

Go to https://data.gov.cz/formulář/registrace-lokálního-katalogu and generate a new file like this.

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
      "@value": "Radmila Velnerová"
    },
    "http://www.w3.org/2006/vcard/ns#hasEmail": "rvelnerova@kr-kralovehradecky.cz"
  },
  "http://xmlns.com/foaf/0.1/homepage": {
    "@id": "https://datakhk.cz/"
  }
}
```

Send this file using **mojedatovaschranka.cz** to address **m3hp53v**. Attach this file like `lkod.txt` and subject **NKOD**.

### LKOD

LKOD file looks like this.

```
{
  "@context": "https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld",
  "iri": "https://open.datakhk.cz/katalog.jsonld",
  "typ": "Katalog",
  "domovská_stránka": "https://datakhk.cz",
  "název": {
    "cs": "Katalog otevřených dat Královéhradeckého kraje"
  },
  "popis": {
    "cs": "Otevřená data Kralovéhradeckého kraje. Datové sady jsou ve strojově čitelných formátech, volně přístupné k libovolným (legálním) účelům využití, bez licenčních omezení."
  },
  "poskytovatel": "https://rpp-opendata.egon.gov.cz/odrpp/zdroj/orgán-veřejné-moci/70889546",
  "kontaktní_bod": {
    "typ": "Organizace",
    "jméno": {
      "cs": "Krajský úřad Královéhradeckého kraje / Odbor analýz a podpory řízení"
    },
    "e-mail": "mailto:datakhk@kr-kralovehradecky.cz"
  },
  "datová_sada": [
    "https://open.datakhk.cz/0cabb88f46bf484f81e4cd9a7299d8dc_0.jsonld",
  ]
}
```

## Index

- NKOD = `Národní katalog otevřených dat`
- LKOD = `Lokální katalog otevřených dat`
- KHK = `Královéhradecký kraj`

## Credits

This package is currently maintained by these authors.

<a href="https://github.com/f3l1x">
    <img width="80" height="80" src="https://avatars2.githubusercontent.com/u/538058?v=3&s=80">
</a>
