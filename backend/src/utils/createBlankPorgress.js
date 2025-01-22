

exports.createBlankPorgress = (n) => {
    returnList = []
    for (let i = 0; i < n; i++) {
        returnList.push({
            "stepId":n+1,
            "reached":false,
            "timeReached":null
        })
    }
    return returnList
}