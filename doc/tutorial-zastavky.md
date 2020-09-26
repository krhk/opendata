# Vytvoření souboru datové sady - zastávky IREDO

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

### 1. Analýza dat

Data jsou čistá. Problém je jen s kódováním, které není UTF-8 ale CP-1250. Následuje analýza jednotlivých sloupců.

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

### 2. Vytvoření CSVW schema

Dle doporučení vytvoříme [CSVW schema](https://www.w3.org/TR/tabular-data-primer/), které je popisuje jednotlivé sloupce v CSV. Výsledkem je soubor [autobusové-zastávky-iredo.csv-metadata.json](../src/katalog/autobusové-zastávky-iredo/autobusové-zastávky-iredo.csv-metadata.json).

### 3. Vytvoření souboru s metadaty datové sady v JSON-LD

Nyní je potřeba popsat datovou sadu metadatovým souborem, kterému bude rozumět NKOD. Použijeme [formulář pro vytvoření datové sady](https://dev.nkod.opendata.cz/formulář/registrace-datové-sady) a na konci soubor stáhneme (dev verze podporuje všechny nezbytné atributy). Na konci zvolíme způsob stažení LKOD a výsledkem je JSON-LD soubor [autobusové-zastávky-iredo.jsonld](../src/katalog/autobusové-zastávky-iredo/index.jsonld).

### 4. Přidání dokumentace

Založíme [README](../src/katalog/autobusové-zastávky-iredo/README.md) soubor, který bude obsahovat dokumentaci sady pro konzumenty.
