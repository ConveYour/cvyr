const fs = require('fs')
module.exports = path => {
  try {
    let data = fs.readFileSync(path).toString()
    return JSON.parse(data)
  }
  catch (e) {
    return false
  }
}