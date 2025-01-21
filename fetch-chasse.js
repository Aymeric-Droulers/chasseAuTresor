document.addEventListener('DOMContentLoaded', async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const chasseId = params.get('id');
      if (!chasseId) {
        throw new Error("Aucun ID fourni dans l'URL.");
      }
  
      const response = await fetch(`http://localhost:3000/api/chasses/${chasseId}`);
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }
      const data = await response.json();
      console.log("Chasse récupérée :", data);
  
      // On initie la page (timer, etc.)
      initChasseData(data);
  
    } catch (err) {
      console.error('Erreur récupération chasse :', err);
      const msg = document.getElementById('message');
      if (msg) {
        msg.textContent = 'Impossible de charger la chasse : ' + err;
      }
    }
  });
  