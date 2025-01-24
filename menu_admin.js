let user_id = null;
// check if user is connected
url="http://localhost:3000/api/session"
fetch(url, {
    method: 'GET',
    credentials:'include',
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
        console.log(data);
    }).catch(error => {
    console.error('Erreur lors de la requête:', error);
    window.location.assign("accueil.html");
});

const url_accounts = "http://localhost:3000/api/accounts";
const url_hunts = "http://localhost:3000/api/chasses";
let chassesCreated = [];
let selected_hunt_id = null;

fetch("http://localhost:3000/api/session", {
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
        user_id = session_data.user_id;

        fetch(`${url_hunts}`, {
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
                const huntSelect = document.getElementById('hunt-select');
                hunts.forEach(hunt => {
                    if (hunt.owner === user_id) {
                        console.log(hunt);
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
            });
    })

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

// Assure-toi que la bibliothèque QRCode.js et jsPDF est incluse dans ton projet
document.getElementById('downloadPdf').addEventListener('click', async () => {
    if (typeof steps === 'undefined' || steps.length === 0) {
        alert('Veuillez ajouter des étapes avant de télécharger.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        // Générer une URL dynamique pour l'indice
        const pageURL = `http://localhost:5500/indice.html?step=${encodeURIComponent(step.hint)}`;
        const qrCodeData = await QRCode.toDataURL(pageURL); // Génération du QR code

        // Ajouter QR code et texte dans le PDF
        doc.text(`Étape ${i + 1}: ${step.name}`, 10, 20); // Texte en haut de la page
        doc.addImage(qrCodeData, 'PNG', 60, 50, 90, 90); // Positionner le QR code

        if (i < steps.length - 1) doc.addPage(); // Ajouter une nouvelle page sauf pour la dernière étape
    }

    doc.save('chasse_au_tresor.pdf'); // Téléchargement du PDF
});
