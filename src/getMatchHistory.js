const axios = require('axios')
module.exports = async detail => {
    let resp = await axios.get(`https://pd.ap.a.pvp.net/match-history/v1/history/${detail.uid}?startIndex=0&endIndex=10`, {
        headers: {
            Authorization: `Bearer ${detail.access_token}`,
            'X-Riot-Entitlements-JWT': detail.entitlements_token
        }
    })
    return resp.data
}