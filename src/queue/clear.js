const fs = require('fs')
const decide = require('../helpers/decide')
const util = require('util')
const path = require('path');
const readdir = util.promisify(fs.readdir)
const unlink = util.promisify(fs.unlink)

const clearFolder = async directory => {
  let files = await readdir( directory )

  for (const file of files) {
    let filePath = path.join(directory, file)
    // console.log(`removing ${filePath}`)
    await unlink(filePath);
  }
  return files.length
}

module.exports = async config => {
  let clear = await decide('Are you sure you want to clear the queue and cache')
  if( !clear ){
    return console.log('OK we will not clear the cache')
  }
  
  let res = {}

  if( config.cache.path ){
    res.cacheCount = await clearFolder(config.cache.path)
  }
  if( config.queue.path ){
    res.queueCount = await clearFolder(config.queue.path)
  }
  
  return res
  
}