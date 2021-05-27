const csv = require('csv-parser')
const fs = require('fs')
const inserter = require('../queue/inserter')

module.exports = ( config, opts ) => {

  let file = config.csv.fromFile

  //inserter wants a common fieldMap, it doesn't concern itself with integration origin
  config.fieldMap = config.csv.fieldMap
  config.dryRun = opts.dry

  const log = {}
  const insert = inserter(config, log)

  const limit = opts.limit || 0

  //for header
  let lines = 0


  return new Promise( resolve => {
    const stream = fs.createReadStream(file)
      .pipe(csv())
      .on('data', line => {
        if( limit && lines >= limit ){
          stream.destroy()
          return resolve( log )
        }
        insert( line )
        lines++
      })
      .on('end', () => {
        resolve( log )
      })
  })
  
}