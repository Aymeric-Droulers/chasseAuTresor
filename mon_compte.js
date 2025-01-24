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
  try {
    const sessionResponse = await fetch("http://localhost:3000/api/session", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!sessionResponse.ok) {
      throw new Error(`Erreur HTTP : ${sessionResponse.status}`);
    }
    const sessionData = await sessionResponse.json();
    console.log('Données de la session:', sessionData);

    // Utiliser l'ID utilisateur de la session
    const userId = sessionData.user_id;
    const userResponse = await fetch(`http://localhost:3000/api/accounts/${userId}`);
    if (!userResponse.ok) {
      throw new Error('Erreur lors du chargement des données utilisateur.');
    }
    const userData = await userResponse.json();

    // Remplir les informations utilisateur
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userEmail').textContent = userData.mail;
    document.getElementById('userPassword').value = userData.password;

    // Charger toutes les chasses
    const huntsResponse = await fetch("http://localhost:3000/api/chasses");
    if (!huntsResponse.ok) {
      throw new Error('Erreur lors du chargement des chasses.');
    }
    const hunts = await huntsResponse.json();

    // Filtrer les chasses créées par l'utilisateur
    const createdHunts = hunts.filter(hunt => hunt.owner === userId);

    // Charger les noms des chasses créées
    const createdList = document.getElementById('createdHunts');
    createdList.innerHTML = '';
    for (const hunt of createdHunts) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `menu_admin.html?id=${hunt._id}`;
      link.textContent = hunt.name || `Chasse ID: ${hunt._id}`;
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
    window.location.assign("accueil.html");
  }
}

// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', loadUserData);

document.getElementById('disconnect').addEventListener('click', disconnect);

function disconnect() {
  fetch('http://localhost:3000/api/logout', {
    method: 'POST',
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
    .then(data => {
      console.log(data);
      window.location.assign("accueil.html");
    }).catch(error => {
      console.error('Erreur lors de la requête:')
  })
}