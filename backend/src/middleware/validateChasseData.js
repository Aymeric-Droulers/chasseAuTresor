
exports.validateChasseData = async (data)=>{
    const {accessCode,name,nbTeams,peopleByTeam,startDate,duration,theme,place}= data;


    //vérification de la présence des éléments obligatoires
    {
        if (!accessCode) {
            return {status: false, message: "Le code d'accès est requis"};
        }

        // Vérification du nom
        if (!name) {
            return {status: false, message: "Le nom de l'événement est requis"};
        }

        // Vérification du nombre de équipes
        if (!nbTeams || nbTeams <= 0) {
            return {status: false, message: "Le nombre d'équipes doit être supérieur à 0"};
        }

        // Vérification du nombre de personnes par équipe
        if (!peopleByTeam || peopleByTeam <= 0) {
            return {status: false, message: "Le nombre de personnes par équipe doit être supérieur à 0"};
        }

        // Vérification de la date de début
        if (!startDate) {
            return {status: false, message: "La date de début est requise"};
        }

        // Vérification de la durée
        if (!duration) {
            return {status: false, message: "La durée est requise"};
        }

        // Vérification du thème
        if (!theme) {
            return {status: false, message: "Le thème est requis"};
        }

        // Vérification du lieu
        if (!place) {
            return {status: false, message: "Le lieu est requis"};
        }
    }


    if (duration <= 0 || isNaN(duration)) {
        return ({status: false, message: "La durée de la chasse doit être un entier postif"});
    }


    return ({status:true,message:"Les données sont valides"});

}
