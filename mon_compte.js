// Fonction pour afficher ou masquer le mot de passe
function togglePassword() {
    const passwordInput = document.getElementById('userPassword');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
  
  // Charger les données utilisateur depuis la base de données
  async function loadUserData() {
  let userId='';
    try {
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
          console.log('Données de la session:', session_data);
        }).catch(error => {
          console.error('Erreur lors de la requête:', error);
          window.location.assign("accueil.html");
      })


      // Utiliser l'ID spécifique pour Aymeric
      const userId = '678e787112a848a6dba28745'; 
      const response = await fetch(`http://localhost:3000/api/accounts/${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données utilisateuuur.');
      }
      const userData = await response.json();
  
      // Remplir les informations utilisateur
      document.getElementById('userName').textContent = userData.name;
      document.getElementById('userEmail').textContent = userData.mail;
      document.getElementById('userPassword').value = userData.password;
  
      // Charger les noms des chasses créées
      const createdList = document.getElementById('createdHunts');
      createdList.innerHTML = '';
      for (const chasseId of userData.chassesCreated) {
        const chasseDetails = await fetch(`http://localhost:3000/api/chasses/${chasseId}`);
        if (!chasseDetails.ok) {
          throw new Error(`Erreur lors du chargement de la chasse ID: ${chasseId}`);
        }
        const chasseData = await chasseDetails.json();
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `menu_admin.html?id=${chasseId}`;
        link.textContent = chasseData.name || `Chasse ID: ${chasseId}`;
        link.className = 'button';
        li.appendChild(link);
        createdList.appendChild(li);
      }
  
      // Charger les noms des chasses rejointes
      const joinedList = document.getElementById('joinedHunts');
      joinedList.innerHTML = '';
      for (const chasseId of userData.chassesParticipated) {
        const chasseDetails = await fetch(`http://localhost:3000/api/chasses/${chasseId}`);
        if (!chasseDetails.ok) {
          throw new Error(`Erreur lors du chargement de la chasse ID: ${chasseId}`);
        }
        const chasseData = await chasseDetails.json();
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `chasse.html?id=${chasseId}`;
        link.textContent = chasseData.name || `Chasse ID: ${chasseId}`;
        link.className = 'button';
        li.appendChild(link);
        joinedList.appendChild(li);
      }
  
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  }
  
  // Charger les données au chargement de la page
  document.addEventListener('DOMContentLoaded', loadUserData);
  