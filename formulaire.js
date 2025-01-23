document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    const formData = new FormData(event.target);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Validation et transformation des données
    try {
        data['duration_hours'] = parseInt(data['duration_hours'], 10);
        data['duration_minutes'] = parseInt(data['duration_minutes'], 10);
        data['nbTeams'] = parseInt(data['nbTeams'], 10);
        data['peopleByTeam'] = parseInt(data['peopleByTeam'], 10);

        if (data['duration_minutes'] > 59 || data['duration_minutes'] < 0 || isNaN(data['duration_minutes'])) {
            throw new Error('La durée en minutes doit être un nombre positif inférieur à 60.');
        }

        if (data['nbTeams'] < 1 || isNaN(data['nbTeams'])) {
            throw new Error('Le nombre d\'équipes doit être supérieur ou égal à 1.');
        }

        if (data['peopleByTeam'] < 1 || isNaN(data['peopleByTeam'])) {
            throw new Error('Le nombre de membres par équipe doit être supérieur ou égal à 1.');
        }

        data['duration'] = data['duration_hours'] * 60 + data['duration_minutes'];
        if (data['duration'] < 1) {
            throw new Error('La durée totale de la chasse doit être supérieure à 1 minute.');
        }

        const startDate = new Date(data['startDate']);
        if (startDate < new Date()) {
            throw new Error('La date de départ doit être dans le futur.');
        }
        data['startDate'] = startDate.toISOString();

        data['randomDeparture'] = document.getElementById('randomDeparture').checked;
        data['randomSteps'] = document.getElementById('randomSteps').checked;
        data['themes'] = data['themes'].split(',').filter((value) => value.trim() !== '');

        delete data['duration_hours'];
        delete data['duration_minutes'];
    } catch (error) {
        alert(error.message);
        return;
    }

    // Vérification du code d'accès unique
    try {
        const response = await fetch('http://localhost:3000/api/chasses');
        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.statusText}`);
        }
        const existingChasses = await response.json();
        const accessCodeExists = existingChasses.some(
            (chasse) => chasse.accessCode === data.accessCode
        );
        if (accessCodeExists) {
            throw new Error('Le code d\'accès existe déjà. Veuillez en choisir un autre.');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du code d\'accès :', error);
        alert(error.message);
        return;
    }

    // Envoi des données au serveur
    try {
        const url = 'http://localhost:3000/api/chasses/addChasse';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la création de la chasse : ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Chasse créée avec succès :', result);

        // Redirection après succès
        window.location.assign('menu_admin.html');
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
        alert(`Une erreur est survenue : ${error.message}`);
    }
});

// Remplissage automatique des champs pour tester rapidement
document.getElementById('auto-fill').addEventListener('click', function () {
    document.getElementById('name').value = 'Chasse au trésor test';
    document.getElementById('nbTeams').value = 5;
    document.getElementById('peopleByTeam').value = 4;
    document.getElementById('startDate').value = '2025-12-31T12:00';
    document.getElementById('duration_hours').value = 2;
    document.getElementById('duration_minutes').value = 30;
    document.getElementById('accessCode').value = 'TEST1234';
    document.getElementById('randomDeparture').checked = true;
    document.getElementById('place').value = 'Arras';
    document.getElementById('randomSteps').checked = true;
    document.getElementById('themes').value = 'Médiéval,Difficile,Aventure';
});