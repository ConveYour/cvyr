const fs = require('fs')
const util = require('util')
const readdir = util.promisify(fs.readdir)

const fileCount = async directory => {
  let files = await readdir(directory)
  return files.length
}

module.exports = async config => {
  
  let queue = {}

  if (config.cache && config.cache.path) {
    queue.cacheCount = await fileCount(config.cache.path)
  }
  if (config.queue && config.queue.path) {
    queue.queueCount = await fileCount(config.queue.path)
  }

  return queue

}