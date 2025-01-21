const {getChasseById} = require("../utils/getChasseById");
exports.validateStepData = async (data)=> {
    const{chasseId,stepName,stepHint,stepCode}=data;
    if(!chasseId||!stepName||!stepHint||!stepCode){
        return ({success:false,message:"Un champ est manquant"})
    }
    const chasse =await getChasseById(chasseId);
    if(!chasse){
        return ({success:false,message:"La chasse n'exsite pas"})
    }

    return ({success:true,message:"Tout est ok"})

}