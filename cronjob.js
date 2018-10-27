const fs = require('fs')
const https = require('https')
const path = require('path')

const API_KEY = process.env.VRC_API_KEY ? process.env.VRC_API_KEY : 'JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26'
const rootPath = path.resolve(process.env.ROOT_PATH ? process.env.ROOT_PATH : '.')

const worlds = require(path.resolve(rootPath, 'worlds.json'))
const worldKeys = Object.keys(worlds)


function request(worldKey, world, callback) {
  const req = https.get({
    host: 'api.vrchat.cloud',
    path: `/api/1/worlds/${world.id}`,
    headers: { 'cookie': `apiKey=${API_KEY}` },
    auth: process.env.VRC_USERNAME + ':' + process.env.VRC_PASSWORD
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


requestLoop()
