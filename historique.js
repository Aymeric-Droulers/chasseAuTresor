let baseTemporaire = [
]

let url;

let listeChasses = {
    joués : [],
    crées : [],
};

//Recuperation des chasses joués par l'utilisateur.
fetch('http://localhost:3000/api/session', {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
})
.then(session_data => {
    userId = session_data.user_id;
    getChasses(userId);
});

function getChasses(userId) {
    url = `http://localhost:3000/api/accounts/${userId}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(user => {
            listeChasses.joués = user.chassesParticipated;
            listeChasses.crées = user.chassesCreated;
        })
        .catch(error => {
            console.error('Erreur lors de la requête :', error);
        });

    //Recuperation des informations de ces chasses et ajout a l'array basetemporaire


    url = "http://localhost:3000/api/chasses";
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(hunts => {
            hunts.forEach(hunt => {
                if (listeChasses.joués.includes(hunt._id) || listeChasses.crées.includes(hunt._id)) {
                    let teamName;
                    hunt.playingTeams.forEach(team => {
                        if (team.teamPlayersIds.includes(userId)) {
                            teamName = team.teamName;
                        }
                    });
                    let temp = {
                        type: "",
                        startDate: hunt.startDate.substring(0, 10),
                        name: hunt.name,
                        teamName: teamName,
                        nbTeams: hunt.nbTeams,
                        duration: `${Math.floor(hunt.duration / 60)}h${hunt.duration % 60}`,
                        place: hunt.place,
                    }
                    if (listeChasses.joués.includes(hunt._id)) {
                        temp.type = "jouée";
                    } else {
                        temp.type = "crée";
                    }
                    baseTemporaire.push(temp);
                }
            })
            initHistoList();
        })
        .catch(error => {
            console.error('Erreur lors de la requête :', error);
        });
}


function initHistoList(){
    console.log("test1");
    let HistoDiv = document.getElementById("Histo");
    for(let j = 0; j<baseTemporaire.length; j++){
        console.log("test2");
        let elemHisto = document.createElement("div");
        elemHisto.classList.add("elemHisto");
        elemHisto.classList.add("itemHisto");
        let dateChasseHisto = document.createElement("div");
        dateChasseHisto.classList.add("dateChasseHisto");
        dateChasseHisto.classList.add("itemHisto");
        if (baseTemporaire[j].type == "crée"){
            dateChasseHisto.classList.add("chasseCrée");
        }
        else {
            dateChasseHisto.classList.add("chasseJouée");
        }
        dateChasseHisto.innerText = `Chasse du ${baseTemporaire[j].startDate}`;
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
