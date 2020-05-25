module.exports = { 

  account : {
    url : 'http://yourdomain.conveyour.com',
    // from .env
    appKey : 'CONVEYOUR_APPKEY',
    token : 'CONVEYOUR_TOKEN'
  },

  queue: {
    path : './data/queue',
    batchSize : 25
  },

  csv: {
    fromFile : "./path/to/sample.csv",
    fieldMap : {
      id : 'employee_id',
      first_name : true,
      last_name : true,
      email : true,
      //can pass formatter methods like this..
      mobile : ( m, data ) => {
        m = m.replace(/^'/, '')
             .replace(/\D/g, '')
        if( m.length < 10 ){
          return ''
        }
        return '+' + m;
      }
    }
  }

}