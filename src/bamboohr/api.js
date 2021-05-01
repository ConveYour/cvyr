const axios = require('axios')
module.exports = ( opts = {} ) => {

   const key = opts.key || process.env[ 'BAMBOOHR_APIKEY' ] || ''
   const domain = opts.key || process.env[ 'BAMBOOHR_DOMAIN' ] || ''

   const config = {
     baseURL : `https://api.bamboohr.com/api/gateway.php/${domain}/v1`,
     headers : {
        Accept: 'application/json',
     },
     auth: {
         username: key,
         password: Math.random().toString(36)
     }
   }

   return axios.create( config )

}