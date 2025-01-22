const teamList = document.getElementById('teamList');
const createTeamButton = document.getElementById('createTeamButton');
const teamNameInput = document.getElementById('teamName');
const teamCodeInput = document.getElementById('teamCode');
const joinSection = document.getElementById('join-section');
const submitJoinButton = document.getElementById('submitJoinButton');
const cancelJoinButton = document.getElementById('cancelJoinButton');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const enteredCodeInput = document.getElementById('enteredCode');

let teams = [];
let currentTeamIndex = null;

// Create team logic
createTeamButton.addEventListener('click', () => {
    const teamName = teamNameInput.value.trim();
    const teamCode = teamCodeInput.value.trim();

    if (!teamName || !/^\d{4}$/.test(teamCode)) {
        alert('Please provide a valid team name and a 4-digit code.');
        return;
    }

    teams.push({ name: teamName, code: teamCode, members: [] });
    renderTeamList();
    teamNameInput.value = '';
    teamCodeInput.value = '';
});

// Render team list
function renderTeamList() {
    teamList.innerHTML = '';
    teams.forEach((team, index) => {
        const teamElement = document.createElement('div');
        teamElement.className = 'team-item';

        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';

        const teamInfo = document.createElement('span');
        teamInfo.textContent = `Team: ${team.name} | Members: ${team.members.length}`;

        const joinButton = document.createElement('button');
        joinButton.className = 'join-btn';
        joinButton.textContent = 'Join';
        joinButton.addEventListener('click', () => {
            currentTeamIndex = index;
            document.getElementById('teamNameDisplay').textContent = teams[index].name; // Met à jour le nom de l'équipe
            joinSection.style.display = 'flex';
        });

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            teams.splice(index, 1);
            renderTeamList();
        });

        teamHeader.appendChild(teamInfo);
        teamHeader.appendChild(removeButton);

        const teamDetails = document.createElement('div');
        teamDetails.className = 'team-details';

        team.members.forEach(member => {
            const memberInfo = document.createElement('p');
            memberInfo.textContent = `${member.firstName} ${member.lastName}`;
            teamDetails.appendChild(memberInfo);
        });

        teamDetails.appendChild(joinButton);
        teamElement.appendChild(teamHeader);
        teamElement.appendChild(teamDetails);
        teamList.appendChild(teamElement);
    });
}

// Handle Join Team
submitJoinButton.addEventListener('click', () => {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const enteredCode = enteredCodeInput.value.trim();

    if (!firstName || !lastName || enteredCode !== teams[currentTeamIndex].code) {
        alert('Please fill out all fields correctly.');
        return;
    }

    teams[currentTeamIndex].members.push({ firstName, lastName });
    joinSection.style.display = 'none';
    firstNameInput.value = '';
    lastNameInput.value = '';
    enteredCodeInput.value = '';
    renderTeamList();
});

cancelJoinButton.addEventListener('click', () => {
    joinSection.style.display = 'none';
});
