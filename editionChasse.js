let url="http://localhost:3000/api/chasses"

const urlParams = new URLSearchParams(window.location.search);
const huntId = urlParams.get('hunt_id');

fetch(url, {
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
        console.log(hunts);
        hunts.forEach(hunt => {
            if (hunt._id === huntId) {
                console.log(hunt);
                document.getElementById('name').value = hunt.name;
                document.getElementById('nbTeams').value = hunt.nbTeams;
                document.getElementById('peopleByTeam').value = hunt.peopleByTeam;
                const date = new Date(hunt.startDate);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                document.getElementById('startDate').value = date.toISOString().slice(0,16);
                document.getElementById('duration_hours').value = Math.floor(hunt.duration/60)
                document.getElementById('duration_minutes').value = hunt.duration%60;
                document.getElementById('accessCode').value = hunt.accessCode;
                document.getElementById('randomDeparture').checked = hunt.randomDeparture;
                document.getElementById('place').value = hunt.place;
                document.getElementById("randomSteps").checked = hunt.randomSteps;
                if (hunt.themes.length > 0) {
                    document.getElementById("themes").value = hunt.themes.join(',');
                }
            }
        })
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });


document.querySelector('form').addEventListener('submit', async function(event) {

    event.preventDefault(); // Empêche l'envoi du formulaire

    const formData = new FormData(event.target);

    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    data['duration_hours'] = parseInt(data['duration_hours']);
    data['duration_minutes'] = parseInt(data['duration_minutes']);
    data['nbTeams'] = parseInt(data['nbTeams']);
    data['peopleByTeam'] = parseInt(data['peopleByTeam']);

    // Check if the duration is a positive number and less than 60
    if (data['duration_minutes'] > 59 || data['duration_minutes'] < 0 || isNaN(data['duration_minutes'])) {
        alert('La durée en minutes doit être un nombre positif inférieur à 60');
        return;
    }

    // Check if the number of teams is a positive number
    if (data['nbTeams'] < 0 || isNaN(data['nbTeams'])) {
        alert('Le nombre d\'équipes ne peut pas être inférieur à 0');
        return;
    }
    // Check if the number of members is a positive number
    if (data['peopleByTeam'] < 0 || isNaN(data['peopleByTeam'])) {
        alert('Le nombre de membres par équipe ne peut pas être inférieur à 0');
        return;
    }

    // Convert hours to minutes
    data['duration'] = data['duration_hours'] * 60 + data['duration_minutes'];

    // Check if duration is superior to 1 minute
    if (data['duration'] < 1) {
        alert('La durée de la chasse doit être supérieure à 1 minute');
        return;
    }

    // Remove hours and minutes from data
    delete data['duration_hours'];
    delete data['duration_minutes'];

    data['randomDeparture'] = document.getElementById('randomDeparture').checked;
    data['randomSteps'] = document.getElementById('randomSteps').checked;

    // Convert startDate to ISO 8601 format
    const startDate = new Date(data['startDate']);
    data['startDate'] = startDate.toISOString();

    // Convert themes to array
    data['themes'] = data['themes'].split(',');

    // Check if start date is in the future
    if (startDate < new Date()) {
        alert('La date de départ doit être dans le futur');
        return;
    }

    // Remove empty values from themes
    data['themes'] = data['themes'].filter(function(value) {
        return value !== '';
    });

    console.log(data);

    const url = `http://localhost:3000/api/chasses/${huntId}/edit`;
    console.log(url);
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Réponse du serveur :', data);
        })
        .catch(error => {
            console.error('Erreur lors de la requête :', error);
        });
    window.location.href = `menu_admin.html`;
});

document.getElementById('auto-fill').addEventListener('click', function() {
    document.getElementById('name').value = 'Chasse au trésor test';
    document.getElementById('nbTeams').value = 5;
    document.getElementById('peopleByTeam').value = 4;
    document.getElementById('startDate').value = '2025-12-31T12:00';
    document.getElementById('duration_hours').value = 2;
    document.getElementById('duration_minutes').value = 30;
    document.getElementById('accessCode').value = 'TEST1234';
    document.getElementById('randomDeparture').checked = true;
    document.getElementById('place').value = "Arras";
    document.getElementById("randomSteps").checked = true;
    document.getElementById("themes").value = "Médiéval,Difficile,Aventure";
});