function arvioiHeitto(nopat, aiemmatTuplat) {
  if (nopat.length === 1) {
    return { menetys: nopat[0] === 1, pisteet: nopat[0] === 1 ? 0 : nopat[0], tuplat: 0, syy: "Ykkönen!" };
  }

  const [eka, toka] = nopat;
  const tupla = eka === toka;
  const tuplat = tupla ? aiemmatTuplat + 1 : 0;

  if (tuplat === 3) {
    return { menetys: true, pisteet: 0, tuplat, syy: "Kolme tuplaa peräkkäin!" };
  }
  if ((eka === 1) !== (toka === 1)) {
    return { menetys: true, pisteet: 0, tuplat: 0, syy: "Vain toinen noppa on ykkönen!" };
  }
  if (eka === 1 && toka === 1) {
    return { menetys: false, pisteet: 25, tuplat, syy: "Kaksi ykköstä!" };
  }
  return { menetys: false, pisteet: tupla ? (eka + toka) * 2 : eka + toka, tuplat, syy: tupla ? "Tuplat!" : "" };
}

const asetukset = document.getElementById("asetukset");
const pelialue = document.getElementById("peli");
const aloitusLomake = document.getElementById("aloitusLomake");
const maaraKentta = document.getElementById("pelaajienMaara");
const nimikentat = document.getElementById("nimikentat");
const virhe = document.getElementById("asetusVirhe");
const heitaNappi = document.getElementById("heita");
const pidaNappi = document.getElementById("pida");
const uusintaNappi = document.getElementById("uusinta");
const vuoroOtsikko = document.getElementById("vuoroOtsikko");
let pelaajat = [];
let aktiivinen = 0;
let vuoronPisteet = 0;
let tuplaputki = 0;
let noppienMaara = 1;
let tavoite = 100;
let valmis = false;
let tapahtumat = [];

function lueKokonaisluku(arvo, minimi, maksimi) {
  const teksti = arvo.trim();
  if (!/^\d+$/.test(teksti)) return null;
  const luku = Number(teksti);
  return Number.isInteger(luku) && luku >= minimi && luku <= maksimi ? luku : null;
}

function luoNimikentat(maara) {
  const vanhatNimet = [...nimikentat.querySelectorAll("input")].map(kentta => kentta.value);
  nimikentat.replaceChildren();
  for (let i = 0; i < maara; i++) {
    const rivi = document.createElement("div");
    rivi.className = "kentta";
    const otsikko = document.createElement("label");
    otsikko.htmlFor = "nimi" + i;
    otsikko.textContent = "Pelaajan " + (i + 1) + " nimi";
    const kentta = document.createElement("input");
    kentta.type = "text";
    kentta.id = "nimi" + i;
    kentta.maxLength = 30;
    kentta.value = vanhatNimet[i] ?? "Pelaaja " + (i + 1);
    rivi.append(otsikko, kentta);
    nimikentat.append(rivi);
  }
}

function paivitaMaara() {
  const maara = lueKokonaisluku(maaraKentta.value, 2, 10);
  if (maara === null) {
    virhe.textContent = "Anna pelaajien määräksi kokonaisluku 2–10.";
    return false;
  }
  virhe.textContent = "";
  if (nimikentat.querySelectorAll("input").length !== maara) luoNimikentat(maara);
  return true;
}

function piirraNopat(arvot = []) {
  const alue = document.getElementById("nopat");
  alue.replaceChildren();
  const paikat = {
    1: [5], 2: [1, 9], 3: [1, 5, 9],
    4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9]
  };
  for (let i = 0; i < noppienMaara; i++) {
    const noppa = document.createElement("div");
    noppa.className = "noppa";
    noppa.setAttribute("aria-hidden", "true");
    if (!arvot.length) {
      noppa.classList.add("odottaa");
      noppa.textContent = "?";
    } else {
      for (const paikka of paikat[arvot[i]]) {
        const piste = document.createElement("span");
        piste.className = "piste";
        piste.style.gridRow = Math.ceil(paikka / 3);
        piste.style.gridColumn = (paikka - 1) % 3 + 1;
        noppa.append(piste);
      }
    }
    alue.append(noppa);
  }
  alue.setAttribute("aria-label", arvot.length ? "Heiton tulos: " + arvot.join(" ja ") : "Noppia ei ole vielä heitetty");
}

function paivitaNakyma(viesti) {
  const taulukko = document.getElementById("pistetaulukko");
  taulukko.replaceChildren();
  pelaajat.forEach((pelaaja, indeksi) => {
    const kortti = document.createElement("div");
    kortti.className = "pelaaja";
    if (indeksi === aktiivinen) kortti.classList.add(valmis ? "voittaja" : "aktiivinen");
    const nimi = document.createElement("h3");
    nimi.textContent = pelaaja.nimi;
    const pisteet = document.createElement("strong");
    pisteet.textContent = pelaaja.pisteet + " / " + tavoite;
    kortti.append(nimi, pisteet);
    if (indeksi === aktiivinen) {
      const merkinta = document.createElement("small");
      merkinta.textContent = valmis ? "Voittaja" : "Vuorossa";
      kortti.append(merkinta);
    }
    taulukko.append(kortti);
  });
  vuoroOtsikko.textContent = valmis ? pelaajat[aktiivinen].nimi + " voitti!" : "Vuorossa: " + pelaajat[aktiivinen].nimi;
  document.getElementById("vuoroPisteet").textContent = vuoronPisteet;
  document.getElementById("tuplaMaara").textContent = tuplaputki;
  document.getElementById("tuplatiedot").hidden = noppienMaara === 1;
  heitaNappi.disabled = valmis;
  pidaNappi.disabled = valmis || vuoronPisteet === 0;
  uusintaNappi.hidden = !valmis;
  document.getElementById("peliviesti").textContent = viesti;
  const lista = document.getElementById("tapahtumat");
  lista.replaceChildren();
  for (const tapahtuma of tapahtumat) {
    const kohta = document.createElement("li");
    kohta.textContent = tapahtuma;
    lista.append(kohta);
  }
}

function kirjaa(teksti) {
  tapahtumat.unshift(teksti);
  tapahtumat = tapahtumat.slice(0, 8);
}

function seuraavaPelaaja() {
  vuoronPisteet = 0;
  tuplaputki = 0;
  aktiivinen = (aktiivinen + 1) % pelaajat.length;
}

function aloitaPeli() {
  pelaajat.forEach(pelaaja => pelaaja.pisteet = 0);
  aktiivinen = 0;
  vuoronPisteet = 0;
  tuplaputki = 0;
  valmis = false;
  tapahtumat = [];
  asetukset.hidden = true;
  pelialue.hidden = false;
  document.getElementById("pelitiedot").textContent = (noppienMaara === 1 ? "Yksi noppa" : "Kaksi noppaa") + " · Tavoite: " + tavoite;
  heitaNappi.textContent = noppienMaara === 1 ? "Heitä noppaa" : "Heitä noppia";
  piirraNopat();
  paivitaNakyma("Peli alkaa! " + pelaajat[0].nimi + " aloittaa.");
  heitaNappi.focus();
}

aloitusLomake.addEventListener("submit", tapahtuma => {
  tapahtuma.preventDefault();
  if (!paivitaMaara()) return;
  const uusiTavoite = lueKokonaisluku(document.getElementById("tavoite").value, 1, 10000);
  if (uusiTavoite === null) {
    virhe.textContent = "Anna tavoitepisteiksi kokonaisluku 1–10000.";
    document.getElementById("tavoite").focus();
    return;
  }
  const kentat = [...nimikentat.querySelectorAll("input")];
  const nimet = kentat.map(kentta => kentta.value.trim());
  const tyhja = nimet.findIndex(nimi => nimi.length === 0);
  if (tyhja !== -1) {
    virhe.textContent = "Anna jokaiselle pelaajalle nimi.";
    kentat[tyhja].focus();
    return;
  }
  if (new Set(nimet.map(nimi => nimi.toLocaleLowerCase("fi"))).size !== nimet.length) {
    virhe.textContent = "Anna pelaajille eri nimet.";
    return;
  }
  pelaajat = nimet.map(nimi => ({ nimi, pisteet: 0 }));
  noppienMaara = Number(document.getElementById("noppienMaara").value);
  tavoite = uusiTavoite;
  aloitaPeli();
});

heitaNappi.addEventListener("click", () => {
  if (valmis) return;
  const nopat = Array.from({ length: noppienMaara }, () => Math.floor(Math.random() * 6) + 1);
  const tulos = arvioiHeitto(nopat, tuplaputki);
  const nimi = pelaajat[aktiivinen].nimi;
  piirraNopat(nopat);
  if (tulos.menetys) {
    const menetetyt = vuoronPisteet;
    kirjaa(nimi + ": " + nopat.join(" + ") + ". " + tulos.syy + " Vuoron " + menetetyt + " pistettä menetettiin.");
    seuraavaPelaaja();
    paivitaNakyma(nimi + ": " + tulos.syy + " Vuoron pisteet nollattiin. Vuorossa on " + pelaajat[aktiivinen].nimi + ".");
  } else {
    tuplaputki = tulos.tuplat;
    vuoronPisteet += tulos.pisteet;
    kirjaa(nimi + ": " + nopat.join(" + ") + " → " + tulos.pisteet + " pistettä. Vuoron pisteet: " + vuoronPisteet + ".");
    paivitaNakyma((tulos.syy ? tulos.syy + " " : "") + "Heitosta " + tulos.pisteet + " pistettä. Jatka tai pidä pisteet.");
  }
});

pidaNappi.addEventListener("click", () => {
  if (valmis || vuoronPisteet === 0) return;
  const pelaaja = pelaajat[aktiivinen];
  pelaaja.pisteet += vuoronPisteet;
  kirjaa(pelaaja.nimi + " piti " + vuoronPisteet + " pistettä. Kokonaispisteet: " + pelaaja.pisteet + ".");
  if (pelaaja.pisteet >= tavoite) {
    valmis = true;
    vuoronPisteet = 0;
    tuplaputki = 0;
    paivitaNakyma(pelaaja.nimi + " voitti " + pelaaja.pisteet + " pisteellä! Onnittelut!");
    uusintaNappi.focus();
  } else {
    seuraavaPelaaja();
    piirraNopat();
    paivitaNakyma(pelaaja.nimi + " piti pisteensä. Vuorossa on " + pelaajat[aktiivinen].nimi + ".");
    heitaNappi.focus();
  }
});

maaraKentta.addEventListener("change", paivitaMaara);
uusintaNappi.addEventListener("click", aloitaPeli);
document.getElementById("asetuksiin").addEventListener("click", () => {
  asetukset.hidden = false;
  pelialue.hidden = true;
  document.getElementById("noppienMaara").focus();
});
luoNimikentat(2);
