let id = 2 // Somehow get the hunt id
const url = "http://localhost:3000/api/chasses";

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
    .then(data => {
        console.log('Réponse du serveur :', data);
        let hunt = data[id];
        console.log(hunt);
        document.getElementById("hunt-name").innerHTML = hunt.name;
        document.getElementById("start-date").innerHTML = formatDateToReadable(hunt.startDate);
        document.getElementById("duration").innerHTML = Math.floor(hunt.duration/60) + "h" + (hunt.duration%60).toString().padStart(2,"0");
        document.getElementById("themes").innerHTML = hunt.themes;
        document.getElementById("random-departure").innerHTML = hunt.randomDeparture;
        document.getElementById("random-steps").innerHTML = hunt.randomSteps;
        document.getElementById("nb-teams").innerHTML = hunt.nbTeams;
        document.getElementById("people-by-team").innerHTML = hunt.peopleByTeam;
        document.getElementById("place").innerHTML = hunt.place;
        document.getElementById("random-steps").checked = hunt.randomSteps;
        document.getElementById("random-departure").checked = hunt.randomDeparture;


    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });

function formatDateToReadable(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
}