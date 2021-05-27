const fieldMapper = require('./fieldMapper')
const fs = require('fs')
module.exports = (config, log = {}) => {
  
  let mapper = fieldMapper(config.fieldMap)
  let qPath = config.queue.path

  let cachePath = ''
  if (config.cache) {
    if (config.cache.enabled && config.cache.path) {
      cachePath = config.cache.path
    }
  }

  log.processedCount = 0
  log.errorCount = 0
  log.cachedHitCount = 0
  log.cachedCount = 0
  log.insertedCount = 0
  log.sample = null

  if( config.dryRun ){
    log.willFilter = []
    log.cacheHits = []
    log.willCache = []
    log.willInsert = []
  }

  const filter = (typeof config.filter === 'function') ? config.filter : record => record

  return async data => {
    let reduced = {}

    log.processedCount++

    mapper.forEach(m => {
      m(data, reduced)
    })

    let id = reduced.id

    if (reduced.cvyr_id) {
      id = reduced.cvyr_id
      delete reduced.cvyr_id
    }

    if (!id) {
      log.errorCount++
      return console.log('no id', reduced);
    }

    log.sample = reduced

    if( !filter(reduced) ){
      if( config.dryRun ){
        log.willFilter.push(reduced)
      }
      return false
    }
    
    let reducedJSON = JSON.stringify(reduced)

    if (cachePath) {
      let _cachePath = `${cachePath}/${id}.json`

      let cached = '{}'

      if (fs.existsSync(_cachePath)) {
        cached = fs.readFileSync(_cachePath, 'utf-8')
      }

      if (cached === reducedJSON) {
        log.cachedHitCount++
        if( config.dryRun ){
          log.cacheHits.push(reduced)
        }
        return
      }
      
      if( config.dryRun ){
        log.willCache.push( reduced )
      }
      else{
        log.cachedCount++
        fs.writeFileSync(_cachePath, reducedJSON)
      }

    }

    let path = `${qPath}/${id}.json`

    if( config.dryRun ){
      log.willInsert.push(reduced)
    }
    else{
      fs.writeFileSync(path, reducedJSON)
    }

    log.insertedCount++
    
  }

}