let foglalasok = [];
let filmek = [];

async function adatokBetoltese() {
    const foglalasResponse = await fetch("data/foglalasok.json");
    foglalasok = await foglalasResponse.json();

    const filmResponse = await fetch("data/filmek.json");
    filmek = await filmResponse.json();

    tablazatMegjelenites();
    kartyakMegjelenites();
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
                <button
                    class="btn btn-danger btn-sm"
                    onclick="foglalasTorles(${foglalas.id})"
                >
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

        kartya.className = "col-md-4 mb-3";

        kartya.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${film.cim}</h5>

                    <p>
                        <strong>Név:</strong>
                        ${foglalas.nev}
                    </p>

                    <p>
                        <strong>Időpont:</strong>
                        ${foglalas.idopont}
                    </p>

                    <p>
                        <strong>Ülőhely:</strong>
                        ${foglalas.ulohely}
                    </p>

                    <p>
                        <strong>Ár:</strong>
                        ${foglalas.ar} Ft
                    </p>

                    <button
                        class="btn btn-danger"
                        onclick="foglalasTorles(${foglalas.id})"
                    >
                        Törlés
                    </button>
                </div>
            </div>
        `;

        kartyaContainer.appendChild(kartya);
    });
}

function foglalasTorles(id) {
    foglalasok = foglalasok.filter(foglalas => foglalas.id !== id);

    tablazatMegjelenites();
    kartyakMegjelenites();
}

function tablazatosNezet() {
    document.getElementById("tablazatosNezet").style.display = "block";
    document.getElementById("kartyasNezet").style.display = "none";

    const tablaGomb = document.getElementById("tablaGomb");
    const kartyaGomb = document.getElementById("kartyaGomb");

    tablaGomb.classList.remove("btn-outline-primary");
    tablaGomb.classList.add("btn-primary");

    kartyaGomb.classList.remove("btn-primary");
    kartyaGomb.classList.add("btn-outline-primary");
}

function kartyasNezet() {
    document.getElementById("tablazatosNezet").style.display = "none";
    document.getElementById("kartyasNezet").style.display = "flex";

    const tablaGomb = document.getElementById("tablaGomb");
    const kartyaGomb = document.getElementById("kartyaGomb");

    tablaGomb.classList.remove("btn-primary");
    tablaGomb.classList.add("btn-outline-primary");

    kartyaGomb.classList.remove("btn-outline-primary");
    kartyaGomb.classList.add("btn-primary");
}

adatokBetoltese();