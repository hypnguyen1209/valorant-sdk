const axios = require('axios')
module.exports = async detail => {
    let resp = await axios.get(`https://pd.ap.a.pvp.net/personalization/v2/players/${detail.uid}/playerloadout`, {
        headers: {
            Authorization: `Bearer ${detail.access_token}`,
            'X-Riot-Entitlements-JWT': detail.entitlements_token
        }
    })
    return resp.data
}