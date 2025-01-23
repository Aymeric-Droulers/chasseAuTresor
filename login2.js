// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
    const mailInput = document.getElementById("Mail");
    const passwordInput = document.getElementById("Password");
    const mailAlert = document.getElementById("Mailalert");
    const connectAlert = document.getElementById("Connectalert");
    const connectButton = document.getElementById("Connect");
    const signupButton = document.getElementById("Signup");

    // Vérifier le format de l'adresse mail
    mailInput.addEventListener("input", () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Vérification simple du format email
        if (!emailRegex.test(mailInput.value)) {
            mailAlert.style.display = "block";
        } else {
            mailAlert.style.display = "none";
        }
    });

    // Action pour le bouton "Se connecter"
    connectButton.addEventListener("click", async () => {
        const email = mailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            connectAlert.textContent = "Tous les champs doivent être remplis.";
            connectAlert.style.display = "block";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email,password })
            });

            if (response.ok) {
                window.location.href = "accueil.html"; // Redirection en cas de succès
            } else {
                connectAlert.textContent = "Le mail ou le mot de passe est incorrect.";
                connectAlert.style.display = "block";
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            connectAlert.textContent = "Une erreur est survenue. Veuillez réessayer.";
            connectAlert.style.display = "block";
        }
    });

    // Action pour le bouton "Créer le compte"
    signupButton.addEventListener("click", async () => {
        const email = mailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            mailAlert.textContent = "Tous les champs doivent être remplis.";
            mailAlert.style.display = "block";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mailAlert.textContent = "Veuillez fournir une adresse mail valide.";
            mailAlert.style.display = "block";
            return;
        }

        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials:'include',
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("Compte créé avec succès !");
                window.location.href = "/login"; // Redirection vers la page de connexion
            } else {
                mailAlert.textContent = "L'adresse mail existe déjà.";
                mailAlert.style.display = "block";
            }
        } catch (error) {
            console.error("Erreur lors de la création du compte :", error);
            mailAlert.textContent = "Une erreur est survenue. Veuillez réessayer.";
            mailAlert.style.display = "block";
        }
    });
});
