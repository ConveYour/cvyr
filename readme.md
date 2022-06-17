## cvyr 

cvyr is a growing set of CLI tools for ConveYour Customers. 

### What do I use cvyr for?

ETL Processes

- map and ingest a contact csv file and push to ConveYour
- sync BambooHR roster and push to ConveYour

`./cvr`

```
Usage: index [options] [command]

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  queue-csv [options]       process csv and insert rows into queue
  queue-bamboohr [options]  insert employee directory into queue
  queue-clear               clear the queue cache and and all unprocessed records
  queue-process [options]   process the queue sending to ConveYour
  queue-stats               get stats on queue and queue cache
  queue-search [options]    search the queue and cache for any value
  help [command]            display help for command
```