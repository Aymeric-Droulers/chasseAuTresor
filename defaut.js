var Create = document.getElementById("Create");
var Join = document.getElementById("Join");
var History = document.getElementById("History");
var Codealert = document.getElementById("Codealert");

Create.addEventListener("click",DoCreate);
Join.addEventListener("click",DoJoin);

function DoCreate(){
    window.location.assign('admin.html');
}

function DoJoin(){
    var Code = document.getElementById("Code");
    Codealert.style.display = "none";
    async function fetchDataAndProcess() {
        try {
            const response = await fetch("http://localhost:3000/api/chasses");
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const codeattendu = await response.json(); // Assigner directement les données
            // Utiliser total dans la boucle
            for(let i = 0; i < codeattendu.length; i++){
                console.log(Codealert.style.display)
                if(Code.value == codeattendu[i]["accessCode"] && Codealert.style.display == "none"){
                    //window.location.assign('defaut.html');
                    console.log("ça marche");
                }
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
            Codealert.style.display = "block";
        }
        
    }
    fetchDataAndProcess();
}