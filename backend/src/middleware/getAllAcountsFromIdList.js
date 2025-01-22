import {getAccountById} from "../utils/getAccountById";

exports.getAllAcountsFromIdList=(list)=>{
    let returnList = [];
    for(let accountId in list){
       returnList.push(getAccountById(accountId));
    }
    return returnList;
}