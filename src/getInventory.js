const axios = require('axios')
module.exports = async detail => {
    let resp = await axios.get(`https://pd.ap.a.pvp.net/personalization/v2/players/${detail.uid}/playerloadout`, {
        headers: {
            Authorization: `Bearer ${detail.access_token}`,
            'X-Riot-Entitlements-JWT': detail.entitlements_token
        }
    })
    const gunsId = resp.data.Guns.map(e => e.SkinLevelID)
    const guns = await Promise.all([
        ...gunsId.map(async item => {
            return axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${item}`)
        })
    ])
    return {
        inventory: [
            ...guns.map(e => e.data)
        ]
    }
}