let filmek = [];

async function adatokBetoltese() {
    const filmResponse = await fetch("data/filmek.json");
    filmek = await filmResponse.json();

    for (const film of filmek) {
        let cimsor3 = document.createElement("h3");
        cimsor3.innerHTML = film.cim;
        document.body.appendChild(cimsor3);
        let filmBekezdes = document.createElement("p");
        filmBekezdes.innerHTML = `Műfaj: ${film.mufaj}<br>Hossz: ${film.hossz} perc<br>Jegyár: ${film.jegyar} Ft.<br>A MŰSORSZÁM ${film.korhatar} ÉVEN ALULIAK SZÁMÁRA NEM AJÁNLOTT!`;
        document.body.appendChild(filmBekezdes);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    
    adatokBetoltese();
});