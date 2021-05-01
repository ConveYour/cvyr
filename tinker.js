global.env = require('dotenv').config()
const config = global.config = require('./config')

const bamboohr = require('./src/bamboohr/api')
const conveyour = require('./src/conveyour/api')

class Resource {
  
  api = null
  opts = null
  
  constructor( api, opts ){
    this.api = api
    this.opts = opts
  }
  
  async get( path ){
    let res = await this.api( this.opts ).get(path)
    process.stdout.write(JSON.stringify(res.data, null, 4) + '\n');
  }
  
}


global.bamboohr = new Resource( bamboohr, config )
global.conveyour = new Resource( conveyour, {
  baseURL : config.account.url,
  appKey: process.env[config.account.appKey],
  token: process.env[config.account.token],
})