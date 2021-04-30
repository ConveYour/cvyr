global.env = require('dotenv').config()
global.config = require('./config')

const api = require('./src/bamboohr/api')

global.bamboohr = {
  get: async path => {
    let res = await api().get(path)
    process.stdout.write(JSON.stringify(res.data, null, 4) + '\n');
  }
}