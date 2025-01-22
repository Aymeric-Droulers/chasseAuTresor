/*const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};*/

var Connect = document.getElementById("Connect");
var Signup = document.getElementById("Signup");
Signup.addEventListener("click",DoSignup);
Connect.addEventListener("click",DoConnect);
var Namealert = document.getElementById("Namealert");
var Mailalert = document.getElementById("Mailalert");

function DoSignup(){

    const addAccount = 'http://localhost:3000/api/accounts/addAccount';
    var Name = document.getElementById("Name").value;
    var Password = document.getElementById("Password").value; 
    var Mail = document.getElementById("Mail").value;
    //Vérifier que le compte n'existe pas
    
    const data = {}
    data["name"] = Name;
    data["password"] = Password;
    data["mail"] = Mail;
    var total;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        fetch(addAccount, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(exit => {
            Namealert.style.display = "none";
            Mailalert.style.display = "none";
            console.log('Réponse reçue:', exit);
            console.log(Namealert.style.display);
            if(Namealert.style.display == "none" && Mailalert.style.display == "none") {
            window.location.assign('accueil.html');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            Namealert.style.display = "block";
            Mailalert.style.display = "block";
        });
        
}

function DoConnect(){
    //Vérifier que le compte existe
    var Name = document.getElementById("Name").value;
    var Password = document.getElementById("Password").value;
    var Mail = document.getElementById("Mail").value;
    var link = 'http://localhost:3000/api/accounts/getByMail/' + Mail;
    console.log(link)
    Connectalert.style.display = "none";
    async function fetchDataAndProcess() {
        try {
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const total = await response.json(); // Assigner directement les données
    
            // Utiliser total dans la boucle
            if(Name == total["name"] && Password == total["password"] && Connectalert.style.display == "none"){
                window.location.assign('accueil.html');
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
            Connectalert.style.display = "block";
            console.log(link)
        }
        
    }
    fetchDataAndProcess();
}