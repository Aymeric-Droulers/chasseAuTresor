async function accountButton() {
    try {
        const sessionResponse = await fetch("http://localhost:3000/api/session", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!sessionResponse.ok) {
            throw new Error(`Erreur HTTP : ${sessionResponse.status}`);
        }
        const sessionData = await sessionResponse.json();
        console.log('Données de la session:', sessionData);
        Connexion = document.getElementById("Connexion");
        function connect(){window.location.assign('mon_compte.html');}
        Connexion.addEventListener("click", connect);
        console.log("On a ajouté le lien vers mon_compte");
    } catch (e) {
        console.error('Utilisateur déconnecté:',e);
        Connexion = document.getElementById("Connexion");
        function connect(){window.location.assign('login.html');}
        Connexion.addEventListener("click", connect);
        console.log("On a ajouté le lien vers login");
    }
}
accountButton();
