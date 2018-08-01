const fs = require('fs')
const https = require('https')

const apiKey = process.env.API_KEY
const worlds = {
  'sky_club': {
    id: 'wrld_4cda3f9c-2519-43a9-96a2-3c456d71a52a'
  },
  'indexs_home': {
    id: 'wrld_a3a0050c-24a0-4b99-9ed7-a63073187050'
  },
  'club_galaxy': {
    id: 'wrld_860d0a51-a539-4cc5-860e-bd5f82d3a6d3'
  }
}


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

  const path = process.env.FILE_PATH ? `${process.env.FILE_PATH}consolidated_occupants.txt` : 'consolidated_occupants.txt'
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
