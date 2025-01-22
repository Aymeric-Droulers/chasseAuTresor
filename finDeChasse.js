var titre = document.getElementById("titre");
var tableTeams = document.getElementById("listTeams");
var tableClassement = document.getElementById("classement");


let id = 0; // Somehow get the hunt id
const url = "http://localhost:3000/api/chasses";
var hunt;
var teamNameList = document.createElement("tr");
var teamPlayersList = document.createElement("tr");

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
.then(data => {
    hunt = data[id];
    console.log(hunt);
    titre.innerText = "La chasse " + hunt.name + " est terminée.";

    var listStepsNames = document.createElement("tr");

    var teamPlaceHead = document.createElement("th");
    teamPlaceHead.innerText = "Place";
    listStepsNames.appendChild(teamPlaceHead);

    var teamNameHead = document.createElement("th");
    teamNameHead.innerText = "Teams";
    listStepsNames.appendChild(teamNameHead);
    for (let i = 0; i < hunt.steps.length; i++) {
        var newStepName = document.createElement("th");
        newStepName.innerText = hunt.steps[i].stepName;
        listStepsNames.appendChild(newStepName);
    }
    tableClassement.appendChild(listStepsNames);
    
    var nbStepsCompleted = [];
    var tmpTableClassement = [];

    for (let i = 0; i < hunt.playingTeams.length; i++) {
        nbStepsCompleted.push(0);
        var newTeamName = document.createElement("th");
        newTeamName.innerText = hunt.playingTeams[i].teamName;
        teamNameList.appendChild(newTeamName);

        var team = hunt.playingTeams[i].teamPlayersIds;
        var stringTeamMembers = "";
        for (let j = 0; j < hunt.playingTeams[i].teamPlayersIds.length; j++) {
            var newTeamMember = document.createElement("th");
            stringTeamMembers += team[j];
            if (j != hunt.playingTeams[i].teamPlayersIds.length-1) {
                stringTeamMembers += "<br>";
            }
        }
        newTeamMember.innerHTML = stringTeamMembers;
        teamPlayersList.appendChild(newTeamMember);

        var teamProgression = document.createElement("tr");
        var newPlace = document.createElement("th");
        newPlace.innerText = i+1;
        teamProgression.appendChild(newPlace);
        teamProgression.appendChild(newTeamName);
        for (let j = 0; j < hunt.playingTeams[i].teamProgress.length; j++) {
            if (hunt.playingTeams[i].teamProgress[j].reached) {
                nbStepsCompleted[i] += 1;
                var greenSquare = document.createElement("th");
                greenSquare.className = "greenSquare";
                teamProgression.appendChild(greenSquare);
            }
            else {
                var redSquare = document.createElement("th");
                redSquare.className = "redSquare";
                teamProgression.appendChild(redSquare);
            }
        }
        tmpTableClassement.push(teamProgression);
    }
    tableTeams.appendChild(teamNameList);
    tableTeams.appendChild(teamPlayersList);
    for (let i = 0; i < nbStepsCompleted.length; i++) {
        tableClassement.appendChild(tmpTableClassement[indexOfMax(nbStepsCompleted)]);
        nbStepsCompleted[indexOfMax(nbStepsCompleted)] = -1;
    }

    for (let i = 1; i < tableClassement.children.length; i++) {
        tableClassement.children[i].children[0].innerText = i;
    }
})
.catch(error => {
    console.error('Erreur lors de la requête :', error);
});

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}