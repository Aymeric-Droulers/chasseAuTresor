const BASE_URL = 'http://localhost:3000/api'; // URL de l'API

// Références aux éléments HTML
const teamList = document.getElementById('teamList');
const searchInput = document.getElementById('searchTeams');
const floatingCreateButton = document.getElementById('floatingCreateButton');
const createPopup = document.getElementById('create-popup');
const createTeamButton = document.getElementById('createTeamButton');
const cancelCreateButton = document.getElementById('cancelCreateButton');
const teamNameInput = document.getElementById('teamName');
const accessCodeInput = document.getElementById('accessCode');
const joinTeamPopup = document.getElementById('join-team-popup');
const teamNameDisplay = document.getElementById('teamNameDisplay');
const accessCodeInputPopup = document.getElementById('accessCodeInput');
const confirmJoinButton = document.getElementById('confirmJoinButton');
const cancelJoinPopup = document.getElementById('cancelJoinPopup');

let allTeams = []; // Contiendra toutes les équipes

// Fonction pour récupérer les équipes
async function fetchTeams() {
    try {
        const response = await fetch(`${BASE_URL}/teams`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des équipes');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fonction pour afficher les équipes
function renderTeamList(teams) {
    const teamList = document.getElementById('teamList');
    teamList.innerHTML = ''; // Vider la liste actuelle

    teams.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.className = 'team-item';

        const teamInfo = document.createElement('span');
        teamInfo.textContent = `Équipe : ${team.teamName} | Membres : ${team.teamPlayersIds.length}`;

        const joinButton = document.createElement('button');
        joinButton.textContent = 'Rejoindre';
        joinButton.className = 'join-btn';
        joinButton.addEventListener('click', () => {
            openJoinPopup(team);
        });

        teamElement.appendChild(teamInfo);
        teamElement.appendChild(joinButton);
        teamList.appendChild(teamElement);
    });
}

// Fonction pour afficher le popup de saisie du code d'accès
function openJoinPopup(team) {
    const joinPopup = document.getElementById('join-team-popup');
    joinPopup.classList.remove('hidden');

    // Configurer le popup avec les infos de l'équipe
    document.getElementById('teamNameDisplay').textContent = `Équipe : ${team.teamName}`;
    joinPopup.dataset.teamId = team.teamId; // Enregistrer l'ID de l'équipe dans le dataset
    joinPopup.dataset.accessCode = team.accessCode; // Enregistrer le code d'accès attendu
}



// Fonction pour ajouter une équipe
async function addTeam(teamName, accessCode) {
    try {
        const response = await fetch(`${BASE_URL}/teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName, accessCode }),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la création de l\'équipe');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Une erreur est survenue lors de la création de l\'équipe.');
    }
}

// Charger les équipes au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    // Charge et affiche toutes les équipes
    allTeams = await fetchTeams();
    renderTeamList(allTeams);
});

// Filtrer les équipes en fonction de la recherche
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTeams = allTeams.filter(team => team.teamName.toLowerCase().includes(searchTerm));
    renderTeamList(filteredTeams);
});

// Afficher le pop-up de création
// Désactiver le bouton de création dans le popup si le maximum est atteint
floatingCreateButton.addEventListener("click", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chasseId = urlParams.get("id");

    // Vérifie le nombre d'équipes avant d'ouvrir le popup
    const response = await fetch(`http://localhost:3000/api/chasses/${chasseId}`);
    const chasse = await response.json();

    if (chasse.playingTeams.length >= chasse.nbTeams) {
        alert("Nombre maximum d'équipes atteint. Vous ne pouvez pas créer d'équipe.");
        return;
    }

    createPopup.classList.remove("hidden"); // Affiche le popup
});


// Cacher le pop-up de création
cancelCreateButton.addEventListener('click', () => {
    createPopup.classList.add('hidden');
});


// Récupérer les équipes de la chasse
async function fetchTeamsForChasse(chasseId) {
    try {
        const response = await fetch(`http://localhost:3000/api/chasses/${chasseId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des données de la chasse.");
        
        const chasse = await response.json(); // Récupère la chasse
        const maxTeams = chasse.nbTeams;
        const currentTeams = chasse.playingTeams.length;

        // Affiche les limites
        document.getElementById('maxTeams').textContent = maxTeams;
        document.getElementById('teamList').textContent = ''; // Vide la liste des équipes

        // Désactiver le bouton de création si le maximum est atteint
        if (currentTeams >= maxTeams) {
            document.getElementById('floatingCreateButton').disabled = true;
            document.getElementById('floatingCreateButton').title = "Nombre maximum d'équipes atteint.";
        } else {
            document.getElementById('floatingCreateButton').disabled = false;
            document.getElementById('floatingCreateButton').title = "";
        }

        // Affiche les équipes
        renderTeamList(chasse.playingTeams);
    } catch (error) {
        console.error("Erreur lors de la récupération des équipes :", error);
        alert("Impossible de charger les équipes.");
    }
}

// Appeler fetchTeamsForChasse au chargement
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chasseId = urlParams.get("id");
    if (chasseId) {
        fetchTeamsForChasse(chasseId);
    } else {
        alert("ID de la chasse introuvable.");
    }
});


// Charger les équipes au démarrage
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chasseId = urlParams.get("id");
    if (chasseId) {
        fetchTeamsForChasse(chasseId);
    } else {
        alert("ID de la chasse introuvable.");
    }
});

createTeamButton.addEventListener("click", async () => {
    const teamName = teamNameInput.value.trim();
    const accessCode = accessCodeInput.value.trim();
    const urlParams = new URLSearchParams(window.location.search);
    const chasseId = urlParams.get("id");

    if (!teamName || accessCode.length !== 4) {
        alert("Veuillez saisir un nom d'équipe valide et un code d'accès de 4 chiffres.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/chasses/${chasseId}/addTeam`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName, accessCode }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.error || "Erreur lors de la création de l'équipe.");
            return;
        }

        alert("Équipe créée avec succès !");
        createPopup.classList.add("hidden");
        fetchTeamsForChasse(chasseId); // Recharge la liste des équipes et vérifie les limites
    } catch (error) {
        console.error("Erreur lors de la création de l'équipe :", error);
        alert("Impossible de créer l'équipe. Réessayez plus tard.");
    }
});

// Récupérer les informations de la chasse pour afficher les limites
async function fetchChasseInfo(chasseId) {
    try {
        const response = await fetch(`http://localhost:3000/api/chasses/${chasseId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données de la chasse.');
        const chasse = await response.json();
        document.getElementById('maxTeams').textContent = chasse.nbTeams;
        document.getElementById('maxPlayers').textContent = chasse.peopleByTeam;
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de la chasse :', error);
        alert('Impossible de charger les limites de la chasse.');
    }
}

// Charger les informations au démarrage
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chasseId = urlParams.get("id");
    if (chasseId) {
        fetchChasseInfo(chasseId);
        fetchTeamsForChasse(chasseId);
    } else {
        alert("ID de la chasse introuvable.");
    }
});



confirmJoinButton.addEventListener('click', async () => {
    const enteredCode = accessCodeInputPopup.value.trim();
    const teamId = document.getElementById('join-team-popup').dataset.teamId;

    try {
        const response = await fetch('http://localhost:3000/api/chasses/joinTeamByCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId, accessCode: enteredCode }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Vous avez rejoint l'équipe "${result.teamName}" avec succès !`);

            // Rediriger vers la chasse avec l'ID
            const urlParams = new URLSearchParams(window.location.search);
            const chasseId = urlParams.get('id');
            window.location.href = `chasse.html?id=${chasseId}&teamId=${teamId}`;
        } else {
            alert(result.message || 'Code d\'accès incorrect. Réessayez.');
        }
    } catch (error) {
        console.error('Erreur lors de la tentative de rejoindre une équipe :', error);
        alert('Impossible de rejoindre l\'équipe. Réessayez plus tard.');
    }
});


async function fetchTeamsForChasse(chasseId) {
    try {
        const response = await fetch(`http://localhost:3000/api/chasses/${chasseId}/allTeams`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des équipes.");
        const teams = await response.json();
        renderTeamList(teams); // Appelle la fonction pour afficher les équipes
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les équipes.");
    }
}

// Charger les équipes au démarrage
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chasseId = urlParams.get("id");
    if (chasseId) {
        fetchTeamsForChasse(chasseId);
    } else {
        alert("ID de la chasse introuvable.");
    }
});


cancelJoinPopup.addEventListener('click', () => {
    joinTeamPopup.classList.add('hidden'); // Cache le pop-up
    accessCodeInputPopup.value = ''; // Réinitialise le champ de saisie
});
