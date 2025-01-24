// 1. Fonction pour récupérer la liste et mettre à jour l'affichage
async function fetchChasses() {
    try {
      const response = await fetch('http://localhost:3000/api/chasses');
      if (!response.ok) {
        throw new Error(`Erreur serveur : ${response.status}`);
      }
      const chasses = await response.json();
  
      const container = document.getElementById('chassesContainer');
      container.innerHTML = '';
  
      // Date et heure actuelles
      const now = new Date();
  
      // Filtrer les chasses pour ne garder que celles qui ne sont pas passées
      const chassesActuelles = chasses.filter(chasse => {
        const dateDebut = new Date(chasse.startDate);
        return dateDebut >= now;
      });
  
      // Affichage des chasses actuelles
      chassesActuelles.forEach(chasse => {
        const titre = document.createElement('h2');
        titre.textContent = chasse.name || "Chasse sans nom";
  
        const dateDebut = new Date(chasse.startDate);
        const dateDebutTxt = dateDebut.toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  
        const dateEl = document.createElement('p');
        dateEl.textContent = `Début : ${dateDebutTxt}`;
  
        const btn = document.createElement('button');
        btn.textContent = "Rejoindre";
        btn.addEventListener('click', () => {
          window.location.href = `accesscode.html?id=${chasse._id}`;
        });
  
        const bloc = document.createElement('div');
        bloc.appendChild(titre);
        bloc.appendChild(dateEl);
        bloc.appendChild(btn);
  
        container.appendChild(bloc);
      });
  
      // Message si aucune chasse n'est disponible
      if (chassesActuelles.length === 0) {
        container.textContent = "Aucune chasse disponible pour le moment.";
      }
  
    } catch (err) {
      console.error(err);
      const container = document.getElementById('chassesContainer');
      container.textContent = "Erreur lors de la récupération des chasses.";
    }
  }
  
  // 2. Au chargement, on appelle fetchChasses()
  document.addEventListener('DOMContentLoaded', () => {
    fetchChasses();
  
    // 3. Mise à jour automatique toutes les 10 secondes
    setInterval(() => {
      fetchChasses();
    }, 10000);
  });
  