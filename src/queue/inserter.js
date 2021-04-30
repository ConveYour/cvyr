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

  log.errorCount = 0
  log.cachedHitCount = 0
  log.insertedCount = 0

  return async data => {
    let reduced = {}

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
    
    let reducedJSON = JSON.stringify(reduced)

    if (cachePath) {
      let _cachePath = `${cachePath}/${id}.json`

      let cached = '{}'

      if (fs.existsSync(_cachePath)) {
        cached = fs.readFileSync(_cachePath, 'utf-8')
      }

      if (cached === reducedJSON) {
        log.cachedHitCount++
        return
      }

      fs.writeFileSync(_cachePath, reducedJSON)
    }

    let path = `${qPath}/${id}.json`
    fs.writeFileSync(path, reducedJSON)

    
    log.insertedCount++
  }

}