const env = require('dotenv').config()
const config = require('./config')
const { program } = require('commander')
const queueCSV = require('./src/csv/queue')
const processQueue = require('./src/queue/process')
const queueBambooHR = require('./src/bamboohr/queue' )
const clearQueue = require('./src/queue/clear')

program
  .version('0.0.1')

program
  .command('queue-csv')
  .description('process csv and insert rows into queue')
  .action( () => queueCSV(config) )

program
  .command('queue-bamboohr')
  .description('insert employee directory into queue')
  .action(() => queueBambooHR(config))

program
  .command('queue-clear')
  .description('clear the queue cache and and all unprocessed records')
  .action( () => clearQueue(config) )

program
  .command('queue-process')
  .description('process the queue sending to ConveYour')
  .action( () => processQueue(config) )




program.parse(process.argv)