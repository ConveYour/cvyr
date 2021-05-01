const log = require('./src/helpers/log')
const env = require('dotenv').config()
const config = require('./config')
const { program } = require('commander')
const queueCSV = require('./src/csv/queue')
const queueProcess = require('./src/queue/process')
const queueBambooHR = require('./src/bamboohr/queue' )
const clearQueue = require('./src/queue/clear')
const queueStats = require('./src/queue/stats')
const queueSearch = require('./src/queue/search')

let tasks = [
  {
    cmd: 'queue-csv',
    desc: 'process csv and insert rows into queue',
    run: queueCSV
  },
  {
    cmd: 'queue-bamboohr',
    desc: 'insert employee directory into queue',
    run: queueBambooHR,
    options: [
      ['-l, --limit <number>', 'Limit the number of queued records' ],
    ]
  },
  {
    cmd: 'queue-clear',
    desc: 'clear the queue cache and and all unprocessed records',
    run: clearQueue
  },
  {
    cmd: 'queue-process',
    desc: 'process the queue sending to ConveYour',
    run: queueProcess,
    options: [
      [ '-t, --to <type>', 'Where to send processed records to', 'ConveYour'],
      [ '-b, --batch <number>', 'Batch Size'],
      [ '-d, --debug', 'Turn on debug output'],
    ]
  },
  {
    cmd: 'queue-stats',
    desc: 'get stats on queue and queue cache',
    run: queueStats
  },
  {
    cmd: 'queue-search',
    desc: 'search the queue and cache for any value',
    run: queueSearch,
    options: [
      [ '-q, --query <value>', "search cache and queue. Example: john, 'field1=value&field2=value'"],
    ]
  }
]

program.version('0.0.1')

tasks.forEach( task => {
  let p = program.command(task.cmd).description(task.desc)
  
  if( task.options ){
    task.options.forEach( option => {
      p.option.apply(p, option )
    })
  }

  p.action( async (options) => {
    let res = await task.run(config, options)
    log(res)
  })

})


program.parse(process.argv)