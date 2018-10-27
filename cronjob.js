const fs = require('fs')
const https = require('https')
const path = require('path')
const querystring = require('querystring')

const rootPath = path.resolve(process.env.ROOT_PATH ? process.env.ROOT_PATH : '.')

const worlds = require(path.resolve(rootPath, 'worlds.json'))
const worldKeys = Object.keys(worlds)

const cookies = {}


function authenticate(callback) {
  const req = https.request({
    method: 'POST',
    hostname: 'api.vrchat.cloud',
    path: `/login`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, (res) => {
    res.on('end', () => {
      console.log(res.headers)
      res.headers['set-cookie'].forEach(cookie => {
        cookie.split('=')
        cookies[cookie[0]] = cookie[1]
      })

      callback()
    })
  })
    .on('error', (err) => {
      console.error(err.message)
    })

  req.write(querystring.stringify({
    'username_email': process.env.VRC_USERNAME
    'password': process.env.VRC_PASSWORD
  }))
  req.end()
}


function request(worldKey, world, callback) {
  const req = https.get({
    hostname: 'api.vrchat.cloud',
    path: `/api/1/worlds/${world.id}`,
    headers: { 'cookie': `auth=${cookies.auth}; apiKey=${cookies.apiKey}` }
  }, (res) => {
    let data = ''
    res.on('data', chunk => data += chunk)

    res.on('end', () => {
      worlds[worldKey].rawResponse = JSON.parse(data)
      callback()
    })
  })
    .on('error', (err) => {
      console.error(err.message)
    })

  req.end()
}


function saveConsolidatedOccupoants() {
  let line = Date.now()

  for (let worldKey in worlds) {
    if (!worlds.hasOwnProperty(worldKey)) return

    if (typeof worlds[worldKey].rawResponse.occupants !== 'number') {
      line += 'null'
      continue
    }

    line += ';' + worlds[worldKey].rawResponse.occupants
  }

  const filePath = path.resolve(rootPath, 'consolidated_occupants.txt')
  fs.appendFile(filePath, line + "\n", (err) => {
    if (err) console.error(err)
  })
}


let i = 0
function requestLoop() {
  if (i === worldKeys.length) {
    saveConsolidatedOccupoants()
    return
  }

  request(worldKeys[i], worlds[worldKeys[i]], () => {
    i++
    setTimeout(requestLoop, 1000)
  })
}


authenticate(requestLoop)
