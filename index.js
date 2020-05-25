const env = require('dotenv').config()
const config = require('./config')
const { program } = require('commander')
const queueCSV = require('./src/csv/queue')
const processQueue = require('./src/queue/process')


program
  .version('0.0.1')

  .command('queue-csv')
  .action( () => queueCSV(config) )

program
  .command('queue-process')
  .action( () => processQueue(config) )


program.parse(process.argv)