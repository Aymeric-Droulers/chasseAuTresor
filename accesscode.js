var Join = document.getElementById("Join");
var Codealert = document.getElementById("Codealert");

var Code = document.getElementById("Code");
Codealert.style.display = "none";
Join.addEventListener("click", async () => {
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
        const codeattendu = await response.json();
        //console.log("Chasse récupérée :", codeattendu);
    
        if(Code.value == codeattendu["accessCode"]){
            window.location.href = `chasse.html?id=${codeattendu["_id"]}`
        }
        else{
            Codealert.style.display = "block";
        }
        
    } catch (err) {
        console.error('Erreur récupération chasse :', err);
        const msg = document.getElementById('message');
        if (msg) {
        msg.textContent = 'Impossible de charger la chasse : ' + err;
        }
    }
    });