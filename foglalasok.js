let foglalasok = [];
let filmek = [];

async function adatokBetoltese() {
    const foglalasResponse = await fetch("data/foglalasok.json");
    foglalasok = await foglalasResponse.json();

    const filmResponse = await fetch("data/filmek.json");
    filmek = await filmResponse.json();

    tablazatMegjelenites();
    kartyakMegjelenites();
    filmekBetoltese();
    minimumDatumBeallitasa();
}

function filmekBetoltese() {
    const filmSelect = document.getElementById("film");

    filmek.forEach(film => {
        const option = document.createElement("option");
        option.value = film.id;
        option.textContent = film.cim;

        filmSelect.appendChild(option);
    });
}

function tablazatMegjelenites() {
    const tabla = document.getElementById("foglalasTabla");
    tabla.innerHTML = "";

    foglalasok.forEach(foglalas => {
        const film = filmek.find(film => film.id === foglalas.filmId);
        const sor = document.createElement("tr");

        sor.innerHTML = `
            <td>${foglalas.id}</td>
            <td>${foglalas.nev}</td>
            <td>${film.cim}</td>
            <td>${foglalas.idopont}</td>
            <td>${foglalas.ulohely}</td>
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

function kartyakMegjelenites() {
    const kartyaContainer = document.getElementById("kartyasNezet");
    kartyaContainer.innerHTML = "";

    foglalasok.forEach(foglalas => {
        const film = filmek.find(film => film.id === foglalas.filmId);
        const kartya = document.createElement("div");

        kartya.className = "col-md-4 mb-4";

        kartya.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${film.cim}</h5>
                    <p><strong>Név:</strong> ${foglalas.nev}</p>
                    <p><strong>Időpont:</strong> ${foglalas.idopont}</p>
                    <p><strong>Ülőhely:</strong> ${foglalas.ulohely}</p>
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

document.getElementById("film").addEventListener("change", function () {
    const filmId = Number(this.value);
    const film = filmek.find(film => film.id === filmId);

    if (film) {
        document.getElementById("ar").value = film.jegyar + " Ft";
    } else {
      document.getElementById("ar").value = "";
    }
});

document.getElementById("foglalasForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nev = document.getElementById("nev").value;
    const email = document.getElementById("email").value;
    const telefon = document.getElementById("telefon").value;
    const filmId = Number(document.getElementById("film").value);
    const idopont = document.getElementById("idopont").value.replace("T", " ");
    const ulohely = document.getElementById("ulohely").value.toUpperCase();

    const film = filmek.find(film => film.id === filmId);

    if (!film) {
        hibaUzenet("Válassz ki egy filmet!");
        return;
    }

    const telefonMinta = /^06[237]0\d{7}$/;

    if (!telefonMinta.test(telefon)) {
        hibaUzenet("Hibás telefonszám! Példa: 06301234567");
        return;
    }

    const foglalt = foglalasok.some(foglalas =>
        foglalas.filmId === filmId &&
        foglalas.idopont === idopont &&
        foglalas.ulohely === ulohely
    );

    if (foglalt) {
        hibaUzenet("Ez az ülőhely már foglalt erre az időpontra!");
        return;
    }

    const ujId = foglalasok.length > 0 ? Math.max(...foglalasok.map(f => f.id)) + 1 : 1;

    const ujFoglalas = {
        id: ujId,
        nev: nev,
        email: email,
        telefon: telefon,
        filmId: filmId,
        idopont: idopont,
        ulohely: ulohely,
        ar: film.jegyar
    };

    foglalasok.push(ujFoglalas);

    tablazatMegjelenites();
	kartyakMegjelenites();

    document.getElementById("uzenet").innerHTML = `
        <div class="alert alert-success">
            Sikeres foglalás!<br>
            ${nev}<br>
            ${film.cim}<br>
            Ülőhely: ${ulohely}<br>
            Ár: ${film.jegyar} Ft
        </div>
    `;

    document.getElementById("foglalasForm").reset();
    document.getElementById("ar").value = "";

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

    tablazatMegjelenites();
    kartyakMegjelenites();
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

function minimumDatumBeallitasa() {
    const datumInput = document.getElementById("idopont");
    const most = new Date();

    most.setMinutes(most.getMinutes() - most.getTimezoneOffset());

    datumInput.min = most.toISOString().slice(0, 16);
}

adatokBetoltese();