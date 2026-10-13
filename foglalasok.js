let foglalasok = [];
let filmek = [];
let kivalasztottHelyek = [];
let vetitesiIdopontok = [];

async function adatokBetoltese() {
    const foglalasResponse = await fetch("data/foglalasok.json");
    foglalasok = await foglalasResponse.json();

    const filmResponse = await fetch("data/filmek.json");
    filmek = await filmResponse.json();

    vetitesiIdopontok = foglalasok.map(foglalas => {
        return {
            filmId: foglalas.filmId,
            idopont: foglalas.idopont
        };
    });

    tablazatMegjelenites();
    kartyakMegjelenites();
    filmekBetoltese();
    arFrissites();
}

function filmekBetoltese() {
    const filmSelect = document.getElementById("film");
    const filmSzures = document.getElementById("filmSzures");

    filmek.forEach(film => {
        const option = document.createElement("option");
        option.value = film.id;
        option.textContent = film.cim;
        filmSelect.appendChild(option);

        const szuroOption = document.createElement("option");
        szuroOption.value = film.id;
        szuroOption.textContent = film.cim;
        filmSzures.appendChild(szuroOption);
    });
}

function idopontokBetoltese() {
    const filmId = Number(document.getElementById("film").value);
    const idopontSelect = document.getElementById("idopont");

    idopontSelect.innerHTML = "";

    if (!filmId) {
        idopontSelect.innerHTML = `
            <option value="">Először válassz filmet</option>
        `;
        return;
    }

    const idopontok = vetitesiIdopontok
        .filter(adat => adat.filmId === filmId)
        .map(adat => adat.idopont)
        .filter((idopont, index, lista) => {
            return lista.indexOf(idopont) === index;
        })
        .sort();

    if (idopontok.length === 0) {
        idopontSelect.innerHTML = `
            <option value="">Nincs elérhető időpont</option>
        `;
        return;
    }

    idopontSelect.innerHTML = `
        <option value="">Válassz időpontot</option>
    `;

    idopontok.forEach(idopont => {
        const option = document.createElement("option");

        option.value = idopont;
        option.textContent = idopont;

        idopontSelect.appendChild(option);
    });
}

function foglalasokSzurese() {
    const nevKereses = document.getElementById("nevKereses").value.toLowerCase();
    const filmSzures = Number(document.getElementById("filmSzures").value);

    const szurtFoglalasok = foglalasok.filter(foglalas => {
        const nevEgyezik = foglalas.nev.toLowerCase().includes(nevKereses);
        const filmEgyezik = !filmSzures || foglalas.filmId === filmSzures;

        return nevEgyezik && filmEgyezik;
    });

    tablazatMegjelenites(szurtFoglalasok);
    kartyakMegjelenites(szurtFoglalasok);
}

function tablazatMegjelenites(lista = foglalasok) {
    const tabla = document.getElementById("foglalasTabla");
    tabla.innerHTML = "";

    lista.forEach(foglalas => {
        const film = filmek.find(film => film.id === foglalas.filmId);
        const sor = document.createElement("tr");

        let helyek = foglalas.ulohely;

        if (Array.isArray(helyek)) {
            helyek = helyek.join(", ");
        }

        const jegyek = foglalas.jegyekSzama || 1;

        sor.innerHTML = `
            <td>${foglalas.id}</td>
            <td>${foglalas.nev}</td>
            <td>${film.cim}</td>
            <td>${foglalas.idopont}</td>
            <td>${helyek}</td>
            <td>${jegyek}</td>
            <td>${foglalas.ar} Ft</td>
            <td>
                <button class="torles-gomb" onclick="foglalasTorles(${foglalas.id})">
                    Törlés
                </button>
            </td>
        `;

        tabla.appendChild(sor);
    });
}

function kartyakMegjelenites(lista = foglalasok) {
    const kartyaContainer = document.getElementById("kartyasNezet");
    kartyaContainer.innerHTML = "";

    lista.forEach(foglalas => {
        const film = filmek.find(film => film.id === foglalas.filmId);
        const kartya = document.createElement("div");

        let helyek = foglalas.ulohely;

        if (Array.isArray(helyek)) {
            helyek = helyek.join(", ");
        }

        const jegyek = foglalas.jegyekSzama || 1;

        kartya.className = "col-md-4 mb-4";

        kartya.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${film.cim}</h5>

                    <p><strong>Név:</strong> ${foglalas.nev}</p>
                    <p><strong>Időpont:</strong> ${foglalas.idopont}</p>
                    <p><strong>Ülőhely:</strong> ${helyek}</p>
                    <p><strong>Jegyek:</strong> ${jegyek}</p>
                    <p><strong>Ár:</strong> ${foglalas.ar} Ft</p>

                    <button class="torles-gomb" onclick="foglalasTorles(${foglalas.id})">
                        Törlés
                    </button>
                </div>
            </div>
        `;

        kartyaContainer.appendChild(kartya);
    });
}

function ulohelyekMegjelenites() {
    const helyContainer = document.getElementById("ulohelyek");
    helyContainer.innerHTML = "";

    kivalasztottHelyek = [];
    kivalasztottHelyekKiirasa();

    const filmId = Number(document.getElementById("film").value);
    const idopont = document.getElementById("idopont").value;

    if (!filmId || !idopont) {
        document.getElementById("helyInfo").textContent =
            "Válaszd ki a filmet és az időpontot.";

        return;
    }

    document.getElementById("helyInfo").textContent =
        "Szürke: foglalt, narancssárga: kiválasztott";

    const sorok = ["A", "B", "C", "D", "E"];

    sorok.forEach(sor => {
        for (let i = 1; i <= 8; i++) {
            const hely = sor + i;
            const gomb = document.createElement("button");

            gomb.type = "button";
            gomb.textContent = hely;
            gomb.className = "ulohely";

            const foglalt = helyFoglalt(filmId, idopont, hely);

            if (foglalt) {
                gomb.classList.add("foglalt");
                gomb.disabled = true;
            } else {
                gomb.addEventListener("click", function () {
                    ulohelyKivalasztas(hely, gomb);
                });
            }

            helyContainer.appendChild(gomb);
        }
    });
}

function helyFoglalt(filmId, idopont, hely) {
    return foglalasok.some(foglalas => {
        if (foglalas.filmId !== filmId || foglalas.idopont !== idopont) {
            return false;
        }

        if (Array.isArray(foglalas.ulohely)) {
            return foglalas.ulohely.includes(hely);
        }

        return foglalas.ulohely === hely;
    });
}

function ulohelyKivalasztas(hely, gomb) {
    const jegyekSzama = Number(document.getElementById("jegyekSzama").value);

    if (kivalasztottHelyek.includes(hely)) {
        kivalasztottHelyek = kivalasztottHelyek.filter(h => h !== hely);
        gomb.classList.remove("kivalasztott");
    } else {
        if (kivalasztottHelyek.length >= jegyekSzama) {
            hibaUzenet("Már kiválasztottad a megfelelő számú ülőhelyet!");
            return;
        }

        kivalasztottHelyek.push(hely);
        gomb.classList.add("kivalasztott");
    }

    kivalasztottHelyekKiirasa();
}

function kivalasztottHelyekKiirasa() {
    const szoveg = document.getElementById("kivalasztottHelyek");

    if (kivalasztottHelyek.length === 0) {
        szoveg.textContent = "Kiválasztott helyek: -";
    } else {
        szoveg.textContent =
            "Kiválasztott helyek: " + kivalasztottHelyek.join(", ");
    }
}

function arFrissites() {
    const filmId = Number(document.getElementById("film").value);
    const jegyekSzama = Number(document.getElementById("jegyekSzama").value);

    const film = filmek.find(film => film.id === filmId);

    if (film) {
        const osszeg = film.jegyar * jegyekSzama;
        document.getElementById("ar").value = osszeg + " Ft";
    } else {
        document.getElementById("ar").value = "";
    }
}

document.getElementById("film").addEventListener("change", function () {
    arFrissites();
    idopontokBetoltese();

    kivalasztottHelyek = [];
    document.getElementById("ulohelyek").innerHTML = "";
    kivalasztottHelyekKiirasa();

    document.getElementById("helyInfo").textContent =
        "Válassz időpontot.";
});

document.getElementById("idopont").addEventListener("change", function () {
    ulohelyekMegjelenites();
});

document.getElementById("jegyekSzama").addEventListener("change", function () {
    arFrissites();

    kivalasztottHelyek = [];
    ulohelyekMegjelenites();
});

document.getElementById("foglalasForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nev = document.getElementById("nev").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefon = document.getElementById("telefon").value.trim();
    const filmId = Number(document.getElementById("film").value);
    const idopont = document.getElementById("idopont").value;
    const jegyekSzama = Number(document.getElementById("jegyekSzama").value);

    const film = filmek.find(film => film.id === filmId);

    if (
        nev === "" ||
        email === "" ||
        telefon === "" ||
        !filmId ||
        idopont === ""
    ) {
        hibaUzenet("Minden mező kitöltése kötelező!");
        return;
    }

    const emailMinta = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailMinta.test(email)) {
        hibaUzenet("Hibás email cím!");
        return;
    }

    const telefonMinta = /^06[237]0\d{7}$/;

    if (!telefonMinta.test(telefon)) {
        hibaUzenet("Hibás telefonszám! Példa: 06301234567");
        return;
    }

    if (!film) {
        hibaUzenet("Válassz ki egy filmet!");
        return;
    }

    const ervenyesIdopont = vetitesiIdopontok.some(adat => {
        return adat.filmId === filmId && adat.idopont === idopont;
    });

    if (!ervenyesIdopont) {
        hibaUzenet("Érvénytelen vetítési időpont!");
        return;
    }

    if (kivalasztottHelyek.length !== jegyekSzama) {
        hibaUzenet(`Pontosan ${jegyekSzama} ülőhelyet válassz ki!`);
        return;
    }

    const ujId = foglalasok.length > 0
        ? Math.max(...foglalasok.map(foglalas => foglalas.id)) + 1
        : 1;

    const ujFoglalas = {
        id: ujId,
        nev: nev,
        email: email,
        telefon: telefon,
        filmId: filmId,
        idopont: idopont,
        ulohely: [...kivalasztottHelyek],
        jegyekSzama: jegyekSzama,
        ar: film.jegyar * jegyekSzama
    };

    foglalasok.push(ujFoglalas);

    tablazatMegjelenites();
    kartyakMegjelenites();

    document.getElementById("uzenet").innerHTML = `
        <div class="alert alert-success">
            Sikeres foglalás!<br>
            Név: ${nev}<br>
            Film: ${film.cim}<br>
            Időpont: ${idopont}<br>
            Ülőhelyek: ${kivalasztottHelyek.join(", ")}<br>
            Jegyek száma: ${jegyekSzama}<br>
            Ár: ${film.jegyar * jegyekSzama} Ft
        </div>
    `;

    document.getElementById("foglalasForm").reset();

    document.getElementById("ar").value = "";

    kivalasztottHelyek = [];
    document.getElementById("ulohelyek").innerHTML = "";

    kivalasztottHelyekKiirasa();
    idopontokBetoltese();

    document.getElementById("helyInfo").textContent =
        "Válaszd ki a filmet és az időpontot.";

    setTimeout(() => {
        document.getElementById("ujFoglalasDoboz").style.display = "none";
    }, 1500);
});

function hibaUzenet(szoveg) {
    document.getElementById("uzenet").innerHTML = `
        <div class="alert alert-danger">
            ${szoveg}
        </div>
    `;
}

function foglalasTorles(id) {
    foglalasok = foglalasok.filter(foglalas => foglalas.id !== id);

    foglalasokSzurese();
    ulohelyekMegjelenites();
}

function tablazatosNezet() {
    document.getElementById("tablazatosNezet").style.display = "block";
    document.getElementById("kartyasNezet").style.display = "none";

    document.getElementById("tablaGomb").classList.add("aktiv");
    document.getElementById("kartyaGomb").classList.remove("aktiv");
}

function kartyasNezet() {
    document.getElementById("tablazatosNezet").style.display = "none";
    document.getElementById("kartyasNezet").style.display = "flex";

    document.getElementById("kartyaGomb").classList.add("aktiv");
    document.getElementById("tablaGomb").classList.remove("aktiv");
}

function ujFoglalasMutat() {
    const doboz = document.getElementById("ujFoglalasDoboz");

    if (doboz.style.display === "block") {
        doboz.style.display = "none";
    } else {
        doboz.style.display = "block";

        doboz.scrollIntoView({
            behavior: "smooth"
        });
    }
}

window.addEventListener("scroll", function () {
    const gomb = document.getElementById("felGomb");

    if (!gomb) {
        return;
    }

    if (window.scrollY > 300) {
        gomb.style.display = "block";
    } else {
        gomb.style.display = "none";
    }
});

function oldalTetejere() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

adatokBetoltese();