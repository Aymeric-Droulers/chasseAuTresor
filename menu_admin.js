let user_id = "678e787112a848a6dba28745";
const url_accounts = "http://localhost:3000/api/accounts";
const url_hunts = "http://localhost:3000/api/chasses";
let chassesCreated = [];
let selected_hunt_id = null;

// Récupérer les données du compte
fetch(`${url_accounts}/${user_id}`, {
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
    .then(account => {
        chassesCreated = account.chassesCreated;
        return fetch(url_hunts, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
    })
    .then(hunts => {
        const huntSelect = document.getElementById('hunt-select');
        hunts.forEach(hunt => {
            if (chassesCreated.includes(hunt._id)) {
                const option = document.createElement('option');
                option.value = hunt._id;
                option.textContent = hunt.name;
                huntSelect.appendChild(option);
            }
        });
        updateHuntInfos(hunts);
        // Add an event listener to update hunt infos when infos change
        huntSelect.addEventListener('change', function() {
            updateHuntInfos(hunts);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });

function formatDateToReadable(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
}

function updateHuntInfos(hunts) {
    let huntSelect=document.getElementById("hunt-select")
    const selectedHuntId = huntSelect.value;
    const selectedHunt = hunts.find(hunt => hunt._id === selectedHuntId);
    if (selectedHunt) {
        document.getElementById("hunt-name").innerHTML = selectedHunt.name;
        document.getElementById("start-date").innerHTML = formatDateToReadable(selectedHunt.startDate);
        document.getElementById("duration").innerHTML = Math.floor(selectedHunt.duration / 60) + "h" + (selectedHunt.duration % 60).toString().padStart(2, "0");
        document.getElementById("themes").innerHTML = selectedHunt.themes;
        document.getElementById("random-departure").innerHTML = selectedHunt.randomDeparture ? "☑" : "☒";
        document.getElementById("random-steps").innerHTML = selectedHunt.randomSteps ? "☑" : "☒";
        document.getElementById("nb-teams").innerHTML = selectedHunt.nbTeams;
        document.getElementById("people-by-team").innerHTML = selectedHunt.peopleByTeam;
        document.getElementById("place").innerHTML = selectedHunt.place;
        document.getElementById("access-code").innerHTML = selectedHunt.accessCode;
    }
}

document.getElementById("edit-hunt").addEventListener("click", function() {
    const selectedHuntId = document.getElementById("hunt-select").value;
    window.location.href = `editionChasse.html?hunt_id=${selectedHuntId}`;
});