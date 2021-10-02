const axios = require('axios')
module.exports = async detail => {
    let resp = await axios.get(`https://pd.ap.a.pvp.net/store/v2/storefront/${detail.uid}`, {
        headers: {
            Authorization: `Bearer ${detail.access_token}`,
            'X-Riot-Entitlements-JWT': detail.entitlements_token
        }
    })
    const { DataAssetID } = resp.data.FeaturedBundle.Bundle
    const { SingleItemOffers } = resp.data.SkinsPanelLayout
    const { BundleRemainingDurationInSeconds } = resp.data.FeaturedBundle
    const { SingleItemOffersRemainingDurationInSeconds } = resp.data.SkinsPanelLayout
    const getInfo = await Promise.all([
        axios.get(`https://valorant-api.com/v1/bundles/${DataAssetID}`),
        ...SingleItemOffers.map(async item => {
            return axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${item}`)
        })
    ])
    const store = {
        bundle: {
            ...getInfo[0].data,
            timeRemaining: BundleRemainingDurationInSeconds
        },
        itemOffers: {
            items: [
                ...getInfo.filter((_, i) => i > 0 && i < 5).map(e => e.data)
            ],
            timeRemaining: SingleItemOffersRemainingDurationInSeconds
        }
    }
    if (resp.data.BonusStore.BonusStoreOffers.length === 6) {
        const { BonusStoreRemainingDurationInSeconds } = resp.data.BonusStore
        const { BonusStoreOffers } = resp.data.BonusStore
        const getOffersId = BonusStoreOffers.map(item => item.Offer.OfferID)
        const getNightMarket = await Promise.all([
            ...getOffersId.map(async item => {
                return axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${item}`)
            })
        ])
        const nightMarket = getNightMarket.map((item, i) => {
            return {
                ...item.data,
                discountPercent: BonusStoreOffers[i].DiscountPercent,
                discountCosts: BonusStoreOffers[i].DiscountCosts['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'],
                cost: BonusStoreOffers[i].Offer.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']
            }
        })
        return {
            store,
            nightMarket: {
                data: [
                    ...nightMarket
                ],
                timeRemaining: BonusStoreRemainingDurationInSeconds
            }
        }
    }
    return { store }
}