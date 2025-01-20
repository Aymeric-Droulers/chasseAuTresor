var Connect = document.getElementById("Connect");
var Signup = document.getElementById("Signup");
Signup.addEventListener("click",DoSignup);
Connect.addEventListener("click",DoConnect);

function DoSignup(){
    //Vérifier que le compte n'existe pas
    var Id = document.getElementById("Id");
    var Password = document.getElementById("Password");
    var Mail = document.getElementById("Mail");
    window.location.assign('defaut.html');
}

function DoConnect(){
    //Vérifier que le compte existe
    var Id = document.getElementById("Id");
    var Password = document.getElementById("Password");
    var Mail = document.getElementById("Mail");
    window.location.assign('defaut.html');
}