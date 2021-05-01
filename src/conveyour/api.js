const axios = require('axios')

module.exports = ( opts = {} ) => {

  const baseURL = (opts.baseURL || '').replace(/\/$/, '') + '/api'

  const appKey = opts.appKey || process.env['CONVEYOUR_APPKEY'] || ''
  const token = opts.token || process.env['CONVEYOUR_TOKEN'] || ''

  
  const config = {
    baseURL,
    headers: {
      'x-conveyour-appkey': appKey,
      'x-conveyour-token': token
    }
  }

  console.log({ config })

  return axios.create(config)

}