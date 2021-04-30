const env = require('dotenv').config()
const config = require('./config')
const { program } = require('commander')
const queueCSV = require('./src/csv/queue')
const queueProcess = require('./src/queue/process')
const queueBambooHR = require('./src/bamboohr/queue' )
const clearQueue = require('./src/queue/clear')
const queueStats = require('./src/queue/stats')


let tasks = [
  {
    cmd: 'queue-csv',
    desc: 'process csv and insert rows into queue',
    run: queueCSV
  },
  {
    cmd: 'queue-bamboohr',
    desc: 'insert employee directory into queue',
    run: queueBambooHR
  },
  {
    cmd: 'queue-clear',
    desc: 'clear the queue cache and and all unprocessed records',
    run: clearQueue
  },
  {
    cmd: 'queue-process',
    desc: 'process the queue sending to ConveYour',
    run: queueProcess
  },
  {
    cmd: 'queue-stats',
    desc: 'get stats on queue and queue cache',
    run: queueStats
  }
]

program.version('0.0.1')

tasks.forEach( task => {
  program
    .command(task.cmd)
    .description(task.desc)
    .action( async () => {
      let res = await task.run(config)
      if( res ){
        console.log(res)
      }
    })
})

program.parse(process.argv)