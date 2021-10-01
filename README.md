# valorant-sdk

Toolkit to view ingame information using valorant private API

## Install

```bash
npm i https://github.com/hypnguyen1209/valorant-sdk
```

## Example

```js
const { getPlayerStore, getMatchHistory, ValorantClient, getInventory, getWallet } = require('valorant-sdk')
const valorantClient = new ValorantClient()
const { username, password } = require('../config.json')
const main = async detail => {
    let wallet = await getWallet(detail)
    console.log(wallet)
}
valorantClient.login(username, password).then(main)
```