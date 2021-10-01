const axios = require('axios')
const getPlayerStore = require('./getPlayerStore')
const getMatchHistory = require('./getMatchHistory')
const getInventory = require('./getInventory')
const getWallet = require('./getWallet')
class ValorantClient {
    constructor() {
        this.authorizationURL = 'https://auth.riotgames.com/api/v1/authorization'
        this.entitlementsURL = 'https://entitlements.auth.riotgames.com/api/token/v1'
        this.userInfoURL = 'https://auth.riotgames.com/userinfo'
        this.regexAccessToken = /#access_token=(.+?)&/
        this.username = null
        this.password = null
        this.access_token = null
        this.entitlements_token = null
        this.session = null
        this.uid = null
    }

    headerAuthorization() {
        return {
            Authorization: `Bearer ${this.access_token}`
        }
    }

    headerEntitlements() {
        return {
            'X-Riot-Entitlements-JWT': this.entitlements_token
        }
    }

    async beforeLogin() {
        let body = {
            client_id: 'play-valorant-web-prod',
            nonce: '1',
            redirect_uri: 'https://playvalorant.com/opt_in',
            response_type: 'token id_token',
        }
        let { headers } = await axios.post(this.authorizationURL, body)
        return this.session = headers['set-cookie'].join(';')
    }

    async getEntitlements() {
        let resp = await axios.post(this.entitlementsURL, {}, {
            headers: {
                ...this.headerAuthorization()
            }
        })
        this.entitlements_token = resp.data.entitlements_token
    }

    async getUserInfo() {
        let resp = await axios.post(this.userInfoURL, {}, {
            headers: {
                ...this.headerAuthorization()
            }
        })
        this.uid = resp.data.sub
    }

    async login(username, password) {
        this.username = username
        this.password = password
        await this.beforeLogin()
        let resp = await axios.put(this.authorizationURL, {
            'type': 'auth',
            'username': this.username,
            'password': this.password
        }, {
            headers: {
                'Cookie': this.session
            }
        })
        if (resp.data.error) {
            return Promise.reject({
                error: true,
                message: resp.data.error
            })
        }
        let { uri } = resp.data.response.parameters
        this.access_token = uri.match(this.regexAccessToken)[1]
        await this.getEntitlements()
        await this.getUserInfo()
        return await {
            access_token: this.access_token,
            entitlements_token: this.entitlements_token,
            uid: this.uid
        }
    }
}
module.exports = { getMatchHistory, getPlayerStore, getWallet, ValorantClient, getInventory }