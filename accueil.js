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

function DoSignup(){

    const addAccount = 'http://localhost:3000/api/accounts/addAccount';
    var Name = document.getElementById("Name");
    var Password = document.getElementById("Password"); 
    var Mail = document.getElementById("Mail");
    //Vérifier que le compte n'existe pas
    
    const data = {}
    data["name"] = Name;
    data["password"] = Password;
    data["mail"] = Mail;
    let total = {}

    fetch('http://localhost:3000/api/accounts')
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        total = response.json();
    })
    .then(exit => {
        console.log(exit);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

    //if(data["mail"]=!total["mail"]){
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }
        //Mettre dans la db
        fetch(addAccount, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(exit => {
            console.log('Réponse reçue:', exit);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    
        //window.location.assign('defaut.html');
    }
//}

function DoConnect(){
    //Vérifier que le compte existe
    var Id = document.getElementById("Id");
    var Password = document.getElementById("Password");
    var Mail = document.getElementById("Mail");
    window.location.assign('defaut.html');
}

// URL de l'API
/*
const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

var Connect = document.getElementById("Connect");
var Signup = document.getElementById("Signup");
Signup.addEventListener("click",DoSignup);
Connect.addEventListener("click",DoConnect);

function DoSignup(){
    //Vérifier que le compte n'existe pas
    
    const url = '/accounts/addAccount';
    var Name = document.getElementById("Name");
    var Password = document.getElementById("Password"); 
    var Mail = document.getElementById("Mail");
    
    const data = {}
    data["name"] = Name;
    data["password"] = Password;
    data["mail"] = Mail;

    //Mettre dans la db
    fetch(url, data)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        return response.json();
    })
    .then(data2 => {
        console.log('Réponse reçue:', data2);
    })
    .catch(error => {
        console.error('Erreur:', error);
    });

    window.location.assign('defaut.html');
}
*/
function DoConnect(){
    //Vérifier que le compte existe
    var Id = document.getElementById("Id");
    var Password = document.getElementById("Password");
    var Mail = document.getElementById("Mail");
    window.location.assign('defaut.html');
    //Mettre dans la db
}