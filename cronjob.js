const fs = require('fs')
const https = require('https')

const apiKey = process.env.API_KEY
const rootPath = `${process.env.ROOT_PATH}/` || './';
const worlds = require(`${rootPath}worlds.json`)


function request(worldKey, world, callback) {
  const req = https.get({
    hostname: 'vrchat.com',
    path: `/api/1/worlds/${world.id}`,
    headers: { 'cookie': `apiKey=${apiKey}` }
  }, (res) => {
    let data = ''
    res.on('data', chunk => data += chunk)

    res.on('end', () => {
      worlds[worldKey].rawResponse = JSON.parse(data)
      callback()
    })
  })
    .on('error', (err) => {
      console.error(err.message);
    })

  req.end()
}


function saveConsolidatedOccupoants() {
  let line = Date.now()

  for (let worldKey in worlds) {
    if (!worlds.hasOwnProperty(worldKey)) return

    if (typeof worlds[worldKey].rawResponse.occupants !== 'number') {
      line += ';null'
      continue
    }

    line += ';' + worlds[worldKey].rawResponse.occupants
  }

  const path = `${rootPath}consolidated_occupants.txt`
  fs.appendFile(path, line + "\n", (err) => {
    if (err) console.error(err)
  });
}


let i = 0
function requestLoop() {
  if (i === Object.keys(worlds).length) {
    saveConsolidatedOccupoants()
    return
  }

  request(Object.keys(worlds)[i], worlds[Object.keys(worlds)[i]], () => {
    i++
    setTimeout(requestLoop, 1000)
  })
}


requestLoop()
