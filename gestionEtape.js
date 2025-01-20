var tableSteps = document.getElementById("tableSteps");
var inputStepName = document.getElementById("stepName");
var inputStepHint = document.getElementById("stepHint");
var buttonStepValidation = document.getElementById("validateStep");
var buttonChangeOrder = document.getElementById("changeOrder");
var listSteps = [];
var listDeletes = [];
var listUpArrows = [];
var listDownArrows = [];
var toDelete;


buttonStepValidation.addEventListener("click",createStep);
buttonChangeOrder.addEventListener("click",changeOrder);

function createStep() {
    var nameStep = inputStepName.value;
    var hintStep = inputStepHint.value;
    listSteps.push([nameStep,hintStep]);
    var newStep = document.createElement("tr");
    var tableStepName = document.createElement("th");
    var tableStepHint = document.createElement("th");
    tableStepName.innerText = nameStep;
    tableStepHint.innerText = hintStep;
    newStep.appendChild(tableStepName);
    newStep.appendChild(tableStepHint);
    tableSteps.appendChild(newStep);
    if (buttonChangeOrder.value == "Valider l'ordre actuel") {
        let i = tableSteps.children.length-1;
        var upButton = document.createElement("button");
        upButton.innerText = "↑";
        upButton.id = "up" + i;
        tableSteps.children[i].appendChild(upButton);
        listUpArrows.push(upButton);
        upButton.addEventListener("mousedown",stepGoUp.bind(upButton));

        var downButton = document.createElement("button");
        downButton.innerText = "↓";
        downButton.id = "down" + (i-1);
        tableSteps.children[i-1].appendChild(downButton);
        listDownArrows.push(downButton);
    }
}

function changeOrder() {
    if (buttonChangeOrder.value == "Changer l'ordre des étapes") {
        buttonChangeOrder.value = "Valider l'ordre actuel";
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
        buttonChangeOrder.value = "Changer l'ordre des étapes";
        listUpArrows = [];
        listDownArrows = [];
        for (let i = 0; i < tableSteps.children.length; i++) {
            if (i != 0 && i != tableSteps.children.length-1) {
                tableSteps.children[i].removeChild(tableSteps.children[i].children[4]);
            }
            tableSteps.children[i].removeChild(tableSteps.children[i].children[3]);
            tableSteps.children[i].removeChild(tableSteps.children[i].children[2]);
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

    console.log(toChange+1);

    let tmpTable = tableSteps.children[toChange].innerHTML;
    tableSteps.children[toChange].innerHTML = tableSteps.children[toChange+1].innerHTML;
    tableSteps.children[toChange+1].innerHTML = tmpTable;
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