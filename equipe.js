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
    teamList.innerHTML = ''; // Vide la liste des équipes

    teams.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.className = 'team-item';

        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';

        const teamInfo = document.createElement('span');
        teamInfo.textContent = `Team: ${team.teamName} | Players: ${team.teamPlayersIds.length}`;

        const joinButton = document.createElement('button');
        joinButton.className = 'join-btn';
        joinButton.textContent = 'Join';

        // Affiche le pop-up uniquement au clic sur "Join"
        joinButton.addEventListener('click', () => {
            // Configure le pop-up avec les informations de l'équipe
            teamNameDisplay.textContent = `Team: ${team.teamName}`; // Affiche le nom de l'équipe
            accessCodeInputPopup.value = ''; // Réinitialise le champ de saisie
            joinTeamPopup.dataset.teamId = team._id; // Stocke l'ID de l'équipe
            joinTeamPopup.dataset.accessCode = team.accessCode; // Stocke le code d'accès attendu
            joinTeamPopup.classList.remove('hidden'); // Affiche le pop-up
        });

        teamHeader.appendChild(teamInfo);
        teamHeader.appendChild(joinButton);
        teamElement.appendChild(teamHeader);
        teamList.appendChild(teamElement);
    });
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
floatingCreateButton.addEventListener('click', () => {
    createPopup.classList.remove('hidden');
});

// Cacher le pop-up de création
cancelCreateButton.addEventListener('click', () => {
    createPopup.classList.add('hidden');
});

// Ajouter une nouvelle équipe
createTeamButton.addEventListener('click', async () => {
    const teamName = teamNameInput.value.trim();
    const accessCode = accessCodeInput.value.trim();

    if (teamName.length < 3 || accessCode.length !== 4) {
        alert('Please enter a valid team name and a 4-digit access code.');
        return;
    }

    const result = await addTeam(teamName, accessCode);
    if (result) {
        alert('Team created successfully!');
        createPopup.classList.add('hidden');
        allTeams = await fetchTeams();
        renderTeamList(allTeams);
    }
});

confirmJoinButton.addEventListener('click', async () => {
    const enteredCode = accessCodeInputPopup.value.trim(); // Code saisi par l'utilisateur
    const teamId = joinTeamPopup.dataset.teamId; // ID de l'équipe

    try {
        // Envoyer une requête au backend pour vérifier le code
        const response = await fetch(`${BASE_URL}/teams/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId, accessCode: enteredCode }),
        });

        const result = await response.json();

        if (response.ok) {
            // Affiche un message clair si le code est correct
            alert(`You have successfully joined the team "${result.teamName}"!`);
            joinTeamPopup.classList.add('hidden'); // Cache le pop-up
        } else {
            // Affiche un message d'erreur clair si le code est incorrect
            alert(result.message || 'Failed to join the team. Please try again.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});

cancelJoinPopup.addEventListener('click', () => {
    joinTeamPopup.classList.add('hidden'); // Cache le pop-up
    accessCodeInputPopup.value = ''; // Réinitialise le champ de saisie
});
