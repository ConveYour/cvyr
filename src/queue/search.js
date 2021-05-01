const fs = require('fs')
const getJSON = require('../helpers/getJSON.js')
const qs = require('querystring');

const searchFiles = async (collection, path, matcher )  => {

  return new Promise( resolve => {

    fs.readdir(path, (err, files) => {
      
      files.forEach(file => {
        let filePath = path + '/' + file
        let json  = getJSON(filePath)
        if( json ){
          if ( matcher(json) ){
            collection.push(json)
          }
        }
      })

      resolve(collection)

    })
  })
}

module.exports = async ( config, opts ) => {
  let collection = {}
  let promises = []
 
  let query = (opts.query || '').toLowerCase()

  let lowerString = value => {
    return (value || '').toString().toLowerCase()
  }

  let matcher = json => {
    json = json.traits ? json.traits : json
    return Object.values(json).map(lowerString).find(v => v.includes(query) )
  }
  
  if( query.includes('=') ){
    query = qs.decode(query)
    matcher = json => {
      let matches = []
      json = json.traits ? json.traits : json
      for( let key in query ){
        matches.push(
          lowerString( json[key]).includes(query[key] )
        )
      }
      return matches.every( m => m )
    }
  }



  if( config.cache && config.cache.path ){
    collection.cache = []
    promises.push( 
      searchFiles(collection.cache, config.cache.path, matcher) 
    )
  }

  if (config.queue && config.queue.path) {
    collection.queue = []
    promises.push(
      searchFiles(collection.queue, config.queue.path, matcher )
    )
  }

  await Promise.all( promises )

  let stats = {}
  for( let key in collection ){
    stats[key] = collection[key].length
  }
  
  collection.stats = stats

  return collection

}