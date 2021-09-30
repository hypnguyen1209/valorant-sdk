const axios = require('axios')
module.exports = async detail => {
    let resp = await axios.get(`https://pd.ap.a.pvp.net/store/v1/wallet/${detail.uid}`, {
        headers: {
            Authorization: `Bearer ${detail.access_token}`,
            'X-Riot-Entitlements-JWT': detail.entitlements_token
        }
    })
    return resp.data
}
/*
Valorant Points	                                        85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741
Radianite Points	                                    e59aa87c-4cbf-517a-5983-6e81511be9b7
Unknown (Always has been 0, Probably Future Currency)	f08d4ae3-939c-4576-ab26-09ce1f23bb37
*/