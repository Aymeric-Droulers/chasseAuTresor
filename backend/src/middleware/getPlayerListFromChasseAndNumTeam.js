const {getTeamInChasseByNumber} = require("./getTeamInChasseByNumber");
const {getAccountById} = require("../utils/getAccountById");

exports.getPlayerListFromChasseAndNumTeam = async (id,team)=>{
    const result = await getTeamInChasseByNumber(id, team);
    if (result.status === false) {
        return ({status:false,message:result.message});
    }
    const teamData = result.content;
    const listPlayerIds = teamData.teamPlayersIds;
    const listPlayerData = [];
    for (const accountId in listPlayerIds) {
        const accountData = await getAccountById(listPlayerIds[accountId]);
        listPlayerData.push(accountData);
    }
    return ({status:true,content:listPlayerData});
}