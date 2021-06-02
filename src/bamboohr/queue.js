const api = require('./api')
const inserter = require('../queue/inserter')
const asyncForEach = require('../helpers/asyncForEach')
const chunkArray = require('../helpers/chunkArray')
const cliProgress = require('cli-progress');

module.exports = async ( config, opts ) => {
  if( !config.bamboohr ){
    return console.error('Missing config.bamboohr = { fieldMap, fields, ... }')
  }

  //get all employees from directory
  const res = await api().get('employees/directory')
  let list = res.data.employees
  
  if( opts.limit ){
    list = list.slice(0, opts.limit)
  }
  
  //make sure fieldMap is setup to pass to inserter
  config.fieldMap = config.bamboohr.fieldMap
  const recordFilter = config.bamboohr.filter
  if( recordFilter ){
    config.filter = recordFilter
    if( opts.debug ){
      console.log('filter:', config.filter.toString() )
    }
  }

  config.dryRun = opts.dry

  //log is passed by reference and then returned later
  const log = {}
  const insert = inserter(config, log)

  //fields list dictates what additional basic info fields we pull on each contact
  const fields = (config.bamboohr.fields || []).join(',')
  const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  let count = 0

  // start the progress bar with a total value of 200 and start value of 0
  progress.start(list.length, 0);
  
  const hydrateAndInsert = async data => {

    if (fields && data.id) {
      let employee = await api().get(`employees/${data.id}`, {
        params: { fields }
      })

      if (employee.data)

        data = {
          ...data,
          ...employee.data
        }

    }

    insert(data)

    // update the current value in your application..
    progress.update( count += 1 );
  }

  //split list into three hydration channels
  let chunks = chunkArray(list, Math.floor(list.length / 3) )
  chunks = chunks.map( chunk => {
    return asyncForEach(chunk, hydrateAndInsert)
  })
  
  await Promise.all(chunks)
  
  // stop the progress bar
  progress.stop();

  return log
  
}
