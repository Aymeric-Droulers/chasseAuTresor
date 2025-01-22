var tableSteps = document.getElementById("tableSteps");
var inputStepName = document.getElementById("stepName");
var inputStepHint = document.getElementById("stepHint");
var buttonStepValidation = document.getElementById("validateStep");
var buttonStepsChangeOrder = document.getElementById("changeStepsOrder");
var mapForm = document.getElementById("mapForm");
var mapInput = document.getElementById("mapInput");
var buttonMapValidation = document.getElementById("validateMap");
var tablePoints;
var mapOutput = document.getElementById("mapShow");
var buttonPointsChangeOrder = document.getElementById("changePointsOrder");
var arnaque = document.getElementById("potionD'Invisibilite");
var validationAll = document.getElementById("validateAll");
var listSteps = [];
var listPointsMap = [];
var listDeletes = [];
var listDeletesPoints = [];
var listUpArrows = [];
var listUpArrowsPoints = [];
var listDownArrows = [];
var listDownArrowsPoints = [];
var placingPoints = false;


buttonStepValidation.addEventListener("click",createStep);
buttonStepsChangeOrder.addEventListener("click",changeOrder);
buttonMapValidation.addEventListener("click",validateMap);
buttonPointsChangeOrder.addEventListener("click",changeOrderPoints);
validationAll.addEventListener("click",sendToDB);
mapOutput.addEventListener("mousedown",placePoints);


mapInput.onchange = function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        
       mapOutput.src = e.target.result;
    };

    reader.readAsDataURL(file);
};

function createStep() {
    let changeBack = false;
    if (buttonStepsChangeOrder.value == "Valider l'ordre actuel") {
        changeOrder();
        changeBack = true
    }
    var nameStep = inputStepName.value;
    var hintStep = inputStepHint.value;
    listSteps.push([nameStep,hintStep]);
    var newStep = document.createElement("tr");
    var tableStepNumber = document.createElement("th");
    var tableStepName = document.createElement("th");
    var tableStepHint = document.createElement("th");
    tableStepNumber.innerText = listSteps.length;
    tableStepName.innerText = nameStep;
    tableStepHint.innerText = hintStep;
    newStep.appendChild(tableStepNumber);
    newStep.appendChild(tableStepName);
    newStep.appendChild(tableStepHint);
    tableSteps.appendChild(newStep);
    if (changeBack) {
        changeOrder();
    }
}

function changeOrder() {
    if (buttonStepsChangeOrder.value == "Changer l'ordre des étapes") {
        buttonStepsChangeOrder.value = "Valider l'ordre actuel";
        for (let i = 0; i < tableSteps.children.length; i++) {
            var deleteButton = document.createElement("button");
            deleteButton.innerText = "🗑";
            deleteButton.id = "delete" + i;
            tableSteps.children[i].appendChild(deleteButton);
            listDeletes.push(deleteButton);
            deleteButton.addEventListener("mousedown",deleteStep.bind(deleteButton));

            if (i != 0) {
                var upButton = document.createElement("button");
                upButton.innerText = "↑";
                upButton.id = "up" + i;
                tableSteps.children[i].appendChild(upButton);
                listUpArrows.push(upButton);
                upButton.addEventListener("mousedown",stepGoUp.bind(upButton));
            }
            
            if (i != tableSteps.children.length-1) {
                var downButton = document.createElement("button");
                downButton.innerText = "↓";
                downButton.id = "down" + i;
                tableSteps.children[i].appendChild(downButton);
                listDownArrows.push(downButton);
                downButton.addEventListener("mousedown",stepGoDown.bind(downButton));
            }
        }
    }
    else {
        buttonStepsChangeOrder.value = "Changer l'ordre des étapes";
        listUpArrows = [];
        listDownArrows = [];
        listDeletes = [];
        for (let i = 0; i < tableSteps.children.length; i++) {
            if (i != 0 && i != tableSteps.children.length-1) {
                tableSteps.children[i].removeChild(tableSteps.children[i].children[5]);
            }
            if (tableSteps.children.length != 1) {
                tableSteps.children[i].removeChild(tableSteps.children[i].children[4]);
            }
            tableSteps.children[i].removeChild(tableSteps.children[i].children[3]);
        }
    }
}

function stepGoUp() {
    changeOrder();
    let char = this.id;
    let toChange = "";
    for (let i = 2; i < char.length; i++) {
        toChange += char[i];
    }
    toChange = parseInt(toChange);

    let tmp = listSteps[toChange];
    listSteps[toChange] = listSteps[toChange-1];
    listSteps[toChange-1] = tmp;

    let tmpTable = tableSteps.children[toChange].innerHTML;
    tableSteps.children[toChange].innerHTML = tableSteps.children[toChange-1].innerHTML;
    tableSteps.children[toChange-1].innerHTML = tmpTable;

    tmpTable = tableSteps.children[toChange].children[0].innerText;
    tableSteps.children[toChange].children[0].innerText = tableSteps.children[toChange-1].children[0].innerText;
    tableSteps.children[toChange-1].children[0].innerText = tmpTable;

    changeOrder();
}

function stepGoDown() {
    changeOrder();
    let char = this.id;
    let toChange = "";
    for (let i = 4; i < char.length; i++) {
        toChange += char[i];
    }
    toChange = parseInt(toChange);

    let tmp = listSteps[toChange];
    listSteps[toChange] = listSteps[toChange+1];
    listSteps[toChange+1] = tmp;

    let tmpTable = tableSteps.children[toChange].innerHTML;
    tableSteps.children[toChange].innerHTML = tableSteps.children[toChange+1].innerHTML;
    tableSteps.children[toChange+1].innerHTML = tmpTable;

    tmpTable = tableSteps.children[toChange].children[0].innerText;
    tableSteps.children[toChange].children[0].innerText = tableSteps.children[toChange+1].children[0].innerText;
    tableSteps.children[toChange+1].children[0].innerText = tmpTable;
    changeOrder();
}

function deleteStep() {
    changeOrder();
    let char = this.id;
    let toDelete = "";
    for (let i = 6; i < char.length; i++) {
        toDelete += char[i];
    }
    toDelete = parseInt(toDelete);
    listSteps.splice(toDelete,1);
    tableSteps.removeChild(tableSteps.children[toDelete]);
    changeOrder();
}

function validateMap() {
    var isEmpty = true
    for (let i = "gestionEtape.html".length-1; i >= 0; i--) {
        if (mapOutput.src[mapOutput.src.length-i] != "gestionEtape.html"["gestionEtape.html".length-i]) {
            isEmpty = false;
        }
    }
    if (!isEmpty) {
        mapInput.remove();
        buttonMapValidation.remove();
        tablePoints = document.createElement("table");
        mapForm.appendChild(tablePoints);
        placingPoints = true;
        arnaque.style = "";
    }
}

function placePoints(e) {
    if (placingPoints && listPointsMap.length < listSteps.length) {
        listPointsMap.push([e.clientX-320,e.clientY-100])

        newPointRow = document.createElement("tr");
        rowNumber = document.createElement("th");
        rowNumber.innerText = tablePoints.children.length+1;
        pointNumber = document.createElement("th");
        pointNumber.innerText = tablePoints.children.length+1;

        newPointRow.appendChild(rowNumber);
        newPointRow.appendChild(pointNumber);
        tablePoints.appendChild(newPointRow);

        showNewPoint();
    }
}

function showNewPoint() {
    var newPoint = document.createElement("div");
    newPoint.className = "points";
    newPoint.innerText = listPointsMap.length;
    newPoint.style = "left:" + (listPointsMap[listPointsMap.length-1][0]-5) + "px; top:" + (70+listPointsMap[listPointsMap.length-1][1]) + "px;"
    mapForm.appendChild(newPoint);
}

function changeOrderPoints() {
    if (buttonPointsChangeOrder.value == "Changer l'ordre des points") {
        buttonPointsChangeOrder.value = "Valider l'ordre actuel";
        for (let i = 0; i < tablePoints.children.length; i++) {
            var deleteButton = document.createElement("button");
            deleteButton.innerText = "🗑";
            deleteButton.id = "delete" + i;
            tablePoints.children[i].appendChild(deleteButton);
            listDeletesPoints.push(deleteButton);
            deleteButton.addEventListener("mousedown",deleteStep.bind(deleteButton));

            if (i != 0) {
                var upButton = document.createElement("button");
                upButton.innerText = "↑";
                upButton.id = "up" + i;
                tablePoints.children[i].appendChild(upButton);
                listUpArrowsPoints.push(upButton);
                upButton.addEventListener("mousedown",pointGoUp.bind(upButton));
            }
            
            if (i != tablePoints.children.length-1) {
                var downButton = document.createElement("button");
                downButton.innerText = "↓";
                downButton.id = "down" + i;
                tablePoints.children[i].appendChild(downButton);
                listDownArrowsPoints.push(downButton);
                downButton.addEventListener("mousedown",pointGoDown.bind(downButton));
            }
        }
    }
    else {
        buttonPointsChangeOrder.value = "Changer l'ordre des points";
        listUpArrowsPoints = [];
        listDownArrowsPoints = [];
        listDeletesPoints = [];
        for (let i = 0; i < tablePoints.children.length; i++) {
            if (i != 0 && i != tablePoints.children.length-1) {
                tablePoints.children[i].removeChild(tablePoints.children[i].children[4]);
            }
            if (tablePoints.children.length != 1) {
                tablePoints.children[i].removeChild(tablePoints.children[i].children[3]);
            }
            tablePoints.children[i].removeChild(tablePoints.children[i].children[2]);
        }
    }
}

function pointGoUp() {
    changeOrderPoints();
    let char = this.id;
    let toChange = "";
    for (let i = 2; i < char.length; i++) {
        toChange += char[i];
    }
    toChange = parseInt(toChange);

    let tmp = listPointsMap[toChange];
    listPointsMap[toChange] = listPointsMap[toChange-1];
    listPointsMap[toChange-1] = tmp;

    let tmpTable = tablePoints.children[toChange].innerHTML;
    tablePoints.children[toChange].innerHTML = tablePoints.children[toChange-1].innerHTML;
    tablePoints.children[toChange-1].innerHTML = tmpTable;

    tmpTable = tablePoints.children[toChange].children[0].innerText;
    tablePoints.children[toChange].children[0].innerText = tablePoints.children[toChange-1].children[0].innerText;
    tablePoints.children[toChange-1].children[0].innerText = tmpTable;

    changeOrderPoints();
}

function pointGoDown() {
    changeOrderPoints();
    let char = this.id;
    let toChange = "";
    for (let i = 4; i < char.length; i++) {
        toChange += char[i];
    }
    toChange = parseInt(toChange);

    let tmp = listPointsMap[toChange];
    listPointsMap[toChange] = listPointsMap[toChange+1];
    listSteps[toChange+1] = tmp;

    let tmpTable = tablePoints.children[toChange].innerHTML;
    tablePoints.children[toChange].innerHTML = tablePoints.children[toChange+1].innerHTML;
    tablePoints.children[toChange+1].innerHTML = tmpTable;

    tmpTable = tablePoints.children[toChange].children[0].innerText;
    tablePoints.children[toChange].children[0].innerText = tablePoints.children[toChange+1].children[0].innerText;
    tablePoints.children[toChange+1].children[0].innerText = tmpTable;
    changeOrderPoints();
}

function deleteStep() {
    changeOrderPoints();
    let char = this.id;
    let toDelete = "";
    for (let i = 6; i < char.length; i++) {
        toDelete += char[i];
    }
    toDelete = parseInt(toDelete);
    listPointsMap.splice(toDelete,1);
    tablePoints.removeChild(tablePoints.children[toDelete]);
    mapForm.removeChild(mapForm.children[toDelete+7])
    changeOrderPoints();
}

function sendToDB() {
    const url = "http://localhost:3000/api/chasses/0/addStep";
    var data = {};
    data["steps"] = [];
    data["steps"].push({});
    //data["map"] = mapOutput.src;
    for (let i = 0; i < listSteps.length; i++) {
        console.log(data);
        data["steps"][0]["stepId"] = i;
        data["steps"][0]["stepName"] = listSteps[i][0];
        data["steps"][0]["stepHint"] = listSteps[i][1];
        data["steps"][0]["points"] = listPointsMap[i];
        fetch(url, {
            method: 'POST',
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
    }
}