const { getPlayerStore, getMatchHistory, ValorantClient, getInventory, getWallet } = require('../src')
const valorantClient = new ValorantClient()
const { username, password } = require('../config.json')
const main = async detail => {
    let wallet = await getInventory(detail)
    console.log(JSON.stringify(wallet))
}
const errHandlers = async detail => {
    console.log(detail.message)
}
valorantClient
    .login(username, password)
    .then(main)
    .catch(errHandlers)