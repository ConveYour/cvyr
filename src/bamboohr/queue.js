const api = require('./api')
const inserter = require('../queue/inserter')

module.exports = async config => {
  if( !config.bamboohr ){
    return console.error('Missing config.bamboohr = { fieldMap, ... }')
  }
  
  const res = await api().get('employees/directory')
  const list = res.data.employees
  

  config.fieldMap = config.bamboohr.fieldMap
  const insert = inserter(config)
  
  list.forEach( data => {
    insert(data)
  })
}
