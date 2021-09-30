const { getPlayerStore, getMatchHistory, ValorantClient, getInventory, getWallet } = require('../src')
const valorantClient = new ValorantClient()
const { username, password } = require('../config.json')
const main = async detail => {
    let wallet = await getWallet(detail)
    console.log(wallet)
}
valorantClient.login(username, password).then(main)