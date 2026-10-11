# Projektisuunnitelma: Sika-noppapeli

## Tavoite
Toteutan selaimessa toimivan Sika-noppapelin yhdellä ja kahdella nopalla. Pelin alussa valitaan peliversio, 2–10 pelaajaa, pelaajien nimet ja tavoitepisteet. Oletustavoite on 100 pistettä. Pelaajat käyttävät samaa laitetta vuorotellen.

## Toteutus
HTML muodostaa käyttöliittymän, CSS ulkoasun ja noppien grafiikan. JavaScript hoitaa satunnaiset heitot, vuorot, pistelaskun, asetusten tarkistuksen ja voittajan ilmoittamisen. Viestit näytetään HTML-elementeissä, eikä alert()-ikkunoita käytetä.

## Sääntöjen tulkinta
- Ykkönen tai häviävä heitto nollaa vain nykyisen vuoron pisteet, ei aikaisemmin vahvistettuja pisteitä.
- Kahden nopan tuplat antavat kaksinkertaisen summan. Kaksi ykköstä antaa 25 pistettä.
- Kolmas peräkkäinen tupla saman vuoron aikana päättää vuoron ja nollaa vuoron pisteet myös silloin, kun kolmas tupla on kaksi ykköstä.
- Ei-tupla katkaisee tuplaputken. Pelaajan vaihtuessa putki nollataan.
- Voitto tarkistetaan pisteiden vahvistamisen jälkeen, kun pelaaja lopettaa vuoronsa.

## Työvaiheet
1. Suunnittelu: säännöt, käyttöliittymä ja työn jako.
2. HTML ja CSS: asetukset, pelaajakortit ja noppien grafiikka.
3. JavaScript: pelitila, heitot, vuorot ja voitto.
4. Testaus: molemmat peliversiot, erikoistilanteet ja eri näyttökoot.
5. Julkaisu: lähdekoodi GitHubiin ja peli GitHub Pagesiin.

## Rajaukset
Peli ei tarvitse kirjautumista eikä palvelinta. Pelitilanne ei tallennu sivun päivityksen yli. Kyseessä ei ole verkkopeli eri laitteiden välillä.
