const {getChasseById} = require("../utils/getChasseById");

exports.getTeamInChasseByNumber=async (idChasse,team)=>{
    try {
        const chasse = await getChasseById(idChasse);
        if (!chasse) {
            return ({status: false, error: 'Chasse not found'});
        }
        const listTeams = chasse.playingTeams;
        if (listTeams.length < team) {
            return ({status: false, error: 'Team not found (too High)'});
        }
        if (!listTeams[parseInt(team) - 1]) {
            return ({status: false, error: 'Team not found'});
        }
        return ({status: true, content: listTeams[parseInt(team) - 1]});
    }catch(err){
        return ({status: false, error: err});
    }
}