let baseTemporaire = [];

function initHistoList(){
    let HistoDiv = document.getElementById("Histo");
    for(let j = 0; j<baseTemporaire.length; j++){
        let elemHisto = document.createElement("div");
        elemHisto.classList.add("elemHisto");
        elemHisto.classList.add("itemHisto");
        let dateChasseHisto = document.createElement("div");
        dateChasseHisto.classList.add("dateChasseHisto");
        dateChasseHisto.classList.add("itemHisto");
        dateChasseHisto.innerText = `Chasse du ${baseTemporaire[j].startDate.substring(0,10)}`;
        let nomChasseHisto = document.createElement("div");
        nomChasseHisto.classList.add("nomChasseHisto");
        nomChasseHisto.classList.add("itemHisto");
        nomChasseHisto.innerText = `Nom de la chasse : ${baseTemporaire[j].name}`;
        let nomEquipeHisto = document.createElement("div");
        nomEquipeHisto.classList.add("nomEquipeHisto");
        nomEquipeHisto.classList.add("itemHisto");
        nomEquipeHisto.innerText = `Nom de l'équipe : pas encore implémenté `;   //${baseTemporaire[j].nameEquip};
        let classementHisto = document.createElement("div");
        classementHisto.classList.add("classementHisto");
        classementHisto.classList.add("itemHisto");
        classementHisto.innerText = `Classement : pas encore implémenté`;
        let tempsHisto = document.createElement("div");
        tempsHisto.classList.add("tempsHisto");
        tempsHisto.classList.add("itemHisto");
        tempsHisto.innerText = `Temps : ${baseTemporaire[j].duration}`;
        let placeHisto = document.createElement("div");
        placeHisto.classList.add("placeHisto");
        placeHisto.classList.add("itemHisto");
        placeHisto.innerText = `Place : ${baseTemporaire[j].place}`;
        let mapHisto = document.createElement("img");
        mapHisto.classList.add("mapHisto");
        mapHisto.classList.add("itemHisto");
        mapHisto.src = `images/${baseTemporaire[j].mapFile}`;
        elemHisto.append(dateChasseHisto, nomChasseHisto, nomEquipeHisto, classementHisto, tempsHisto, placeHisto, mapHisto); 
        HistoDiv.append(elemHisto);       
    }
}


function initArray(){
    
}


initHistoList();