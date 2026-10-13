//D- D- DJ ENDRE, B**CH!!!
let filmek = [];

async function adatokBetoltese() {
    const filmResponse = await fetch("data/filmek.json");
    filmek = await filmResponse.json();
    let tablazat = document.getElementById("filmekTabla");
    for (const film of filmek) {
        let tablazatSor = document.createElement("tr");
        tablazatSor.innerHTML = `
        <td>${film.cim}</td>
        <td>${film.mufaj}</td>
        <td>${film.korhatar}</td>
        <td>${film.jegyar} Ft</td>
        `
        tablazat.appendChild(tablazatSor);
    }
    
}

document.addEventListener("DOMContentLoaded", function () {
    adatokBetoltese();
});

window.addEventListener("scroll", function () {
    const gomb = document.getElementById("felGomb");

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