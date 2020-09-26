# Vytvoření souboru datové sady - památné stromy

Vytvoříme datovou sadu pro již existující tabulku ["památné stromy"](http://www.kr-kralovehradecky.cz/cz/kraj-volene-organy/sklad/opendata/cr/pamatne-stromy-113950/). 

Úryvek z CSV tabulky:

```csv
kód,název,typ objektu,poč. vyhl.,poč. souč.,okres,dat. vyhl.,dat. zruš.,orgány ochrany přírody
101233,Špindlerovská jedle,Jednotlivý strom,1,1,Trutnov,18.02.2005,,Správa KRNAP
101234,Třešeň v Horním Lánově,Jednotlivý strom,1,1,Trutnov,09.12.2004,,Správa KRNAP
101235,Vrba v Černém Dole,Jednotlivý strom,1,1,Trutnov,05.01.2005,,Správa KRNAP
101236,Lípa srdčitá č. 2,Jednotlivý strom,1,1,Trutnov,15.05.2004,,MÚ Trutnov
101237,Lípa srdčitá č. 1,Jednotlivý strom,1,1,Trutnov,15.05.2004,,MÚ Trutnov
101238,Dub letní,Jednotlivý strom,1,1,Trutnov,11.05.2004,,MÚ Trutnov
101239,Smrk ztepilý,Jednotlivý strom,1,1,Trutnov,08.05.2004,,Správa KRNAP
101240,"Lípa u ""dřevěnky"" v Dolním Lánově",Jednotlivý strom,1,1,Trutnov,18.02.2004,,MÚ Vrchlabí
```

### 1. Analýza dat

- ✅ CSV struktura je v pořádaku. 
- ⚠️ Kódování je UTF-8, soubor ale obsahuje zbytečný BOM. Odstraníme jej např. příkazem `unix2dos -r památné-stromy.csv`.
- ✅ Konce řádků jsou CRLF.

Následuje analýza obsahu jednotlivých sloupců. Narozdíl od [sady se zastávkami](tutorial-zastavky.md) tentokrát není k dispozici dokumentace sady, význam sloupců proto zkusíme odvodit.

- **kód:** unikátní identifikátor objektu (památky)
- **název:** lidsky čitelný název objektu (památky)
- **typ objektu:** výčtový typ - jeden z:
    - Jednotlivý strom
    - Skupina stromů
    - Stromořadí
- **poč. vyhl.:** počet jedinců ve skupině ke dni vyhlášení (včetně stromů jejichž ochrana již byla zrušena, nebo zaniklé)
- **poč. souč.:** akutální počet jedinců ve skupině
- **okres:** název okresu, ve kterém se strom nachází
- **dat. vyhl.:** datum vyhlášení památky ve formátu DD.MM.YYYY (dle doporučení má být YYYY-MM-DD, ale CSVW schema umožňuje specifikovat vlastní formát)
- **dat. zruš.:** datum zrušení památky (momentálně vždy prázdné)
- **orgány ochrany přírody:** název zodpovědného orgánu ochrany přírody

### 2. Vytvoření CSVW schema

Vytvoříme [CSVW schema](https://www.w3.org/TR/tabular-data-primer/), které je popisuje jednotlivé sloupce v CSV. Výsledkem je soubor [památné-stromy.csv-metadata.json](../src/katalog/památné-stromy/památné-stromy.csv-metadata.json).

Provedeme valildaci dat podle vytvořeného schéma nástrojem [csvw-validator](https://github.com/malyvoj3/csvw-validator/) ([online verze](https://csvw.opendata.cz/)):

```
$ java -jar csvw-validator-cli-app-1.0.0-SNAPSHOT.jar -f -o památné-stromy.csv památné-stromy.csv-metadata.json

Tabular URL: file:/památné-stromy.csv
Result: PASSED
Strict mode: true
Total errors: 0
Warning errors: 0
Error errors: 0
Fatal errors: 0
Processed tables: 1
Processed rows: 370
Processed columns: 9
Errors:

```

### 3. Vytvoření souboru s metadaty datové sady v JSON-LD

Nyní je potřeba popsat datovou sadu metadatovým souborem, kterému bude rozumět NKOD. Použijeme [formulář pro vytvoření datové sady](https://dev.nkod.opendata.cz/formulář/registrace-datové-sady) a na konci soubor stáhneme (dev verze podporuje všechny nezbytné atributy). Na konci zvolíme způsob stažení LKOD a výsledkem je JSON-LD soubor [památné-stromy.jsonld](../src/katalog/památné-stromy/index.jsonld).

### 4. Přidání dokumentace

Založíme [README](../src/katalog/památné-stromy/README.md) soubor, který bude obsahovat dokumentaci sady pro konzumenty.
