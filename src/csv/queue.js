const csv = require('csv-parser')
const fs = require('fs')
const inserter = require('../queue/inserter')


module.exports = config => {

  let file = config.csv.fromFile

  //inserter wants a common fieldMap, it doesn't concern itself with integration origin
  config.fieldMap = config.csv.fieldMap

  const log = {}
  const insert = inserter(config, log)
  
  return new Promise( resolve => {
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', insert)
      .on('end', () => {
        resolve( log )
      })
  })
  
}