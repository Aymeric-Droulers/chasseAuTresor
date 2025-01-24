// chasse.js

let chasseName   = null;
let startTime   = null;   
let endTime     = null;   
let checkingInt = null;   
let isFinished  = false;  
let chasseId    = null;  // ID de la chasse récupéré depuis l'URL

// Initialisation des données de la chasse
function initChasseData(data) {
  chasseName = data.name || "Chasse sans nom";

  // Convert startDate
  startTime = new Date(data.startDate);

  // Fin = startTime + duration minutes
  const durationMs = data.duration * 60 * 1000;
  endTime = new Date(startTime.getTime() + durationMs);

  // Met à jour le titre
  document.getElementById('chasseName').textContent = "Chasse : " + chasseName;

  // Lance la boucle
  checkingInt = setInterval(updateDisplay, 1000);
  updateDisplay();
}

// Fonction de mise à jour de l'affichage
function updateDisplay() {
  if (isFinished) return;

  const now = new Date();
  const preCountdownEl = document.getElementById('preCountdown');
  const mainTimerEl    = document.getElementById('mainTimer');
  const messageEl      = document.getElementById('message');
  const startDateInfo  = document.getElementById('startDateInfo');

  // Chasse finie ?
  if (now >= endTime) {
    clearInterval(checkingInt);
    checkingInt = null;
    isFinished = true;
    preCountdownEl.textContent = '';
    mainTimerEl.textContent    = '00:00';
    messageEl.textContent      = 'La chasse est terminée !';
    startDateInfo.textContent  = '';

    // Redirection vers la page de fin de chasse
    redirectToEndPage();
    return;
  }

  // Avant le début ?
  if (now < startTime) {
    // On affiche la date/heure de début
    const dateDebutTxt = startTime.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    startDateInfo.textContent = `La chasse commencera le ${dateDebutTxt}.`;

    messageEl.textContent   = 'La chasse n\'a pas encore commencé...';
    mainTimerEl.textContent = '00:00'; 

    const diffStart = Math.floor((startTime - now) / 1000); 

    // Gérer 30, 20, 15 (1s) puis 10..0 en continu
    if ([30,20,15].includes(diffStart)) {
      preCountdownEl.textContent = diffStart.toString();
      // Retirer après 1s
      setTimeout(() => {
        if (preCountdownEl.textContent === diffStart.toString()) {
          preCountdownEl.textContent = '';
        }
      }, 1000);
    } else if (diffStart <= 10) {
      preCountdownEl.textContent = diffStart.toString();
    } else {
      preCountdownEl.textContent = '';
    }

  } else {
    // => La chasse est en cours 
    startDateInfo.textContent = ''; // On efface l'info de début
    messageEl.textContent = 'La chasse est en cours !';
    preCountdownEl.textContent = '';

    // Temps restant
    const diffSec = Math.floor((endTime - now) / 1000);
    mainTimerEl.textContent = formatHMS(diffSec);
  }
}

// Redirection vers la page de fin de chasse
function redirectToEndPage() {
  if (chasseId) {
    window.location.href = `finDechasse.html?id=${chasseId}`;
  } else {
    alert("Impossible de rediriger : identifiant de la chasse introuvable.");
  }
}

async function fetchTeamInfo(teamId) {
  try {
      const response = await fetch(`http://localhost:3000/api/teams/${teamId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des informations de l\'équipe.');
      return await response.json();
  } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'équipe :', error);
      alert('Impossible de charger les informations de l\'équipe.');
  }
}


// Formatage du temps en HH:MM:SS
function formatHMS(totalSec) {
  let hrs  = Math.floor(totalSec / 3600);
  let rem  = totalSec % 3600;
  let mins = Math.floor(rem / 60);
  let secs = rem % 60;

  if (hrs < 10)  hrs  = '0' + hrs;
  if (mins < 10) mins = '0' + mins;
  if (secs < 10) secs = '0' + secs;

  return `${hrs}:${mins}:${secs}`;
}

document.getElementById("teamListButton").addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const chasseId = urlParams.get("id");
  if (chasseId) {
      window.location.href = `equipe.html?id=${chasseId}`;
  } else {
      alert("ID de la chasse introuvable.");
  }
});

// Fonction pour récupérer les données de la chasse
async function fetchChasseData() {
  const urlParams = new URLSearchParams(window.location.search);
  const chasseId = urlParams.get('id');
  const teamId = urlParams.get('teamId'); // Récupérer l'ID de l'équipe dans l'URL

  if (!chasseId) {
      document.getElementById('message').textContent = 'Chasse non trouvée.';
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/api/chasses/${chasseId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des données de la chasse.');
      const chasseData = await response.json();

      // Initialiser les données de la chasse
      initChasseData(chasseData);

      // Récupérer et afficher les infos de l'équipe
      if (teamId) {
          const teamInfo = await fetchTeamInfo(teamId);
          document.getElementById('teamName').textContent = teamInfo.teamName;
          document.getElementById('teamMembers').textContent = teamInfo.teamPlayersIds.join(', ');
      }
  } catch (error) {
      console.error('Erreur lors de la récupération des données de la chasse :', error);
      document.getElementById('message').textContent = 'Erreur lors de la récupération des données.';
  }
}


// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", fetchChasseData);
