const fs = require('fs')
const axios = require('axios')
const cyapi = require('../conveyour/api')
const createCSV = require('../csv/create')
const log = require('../helpers/log')
const getJSON = require('../helpers/getJSON.js')

const getBatch = opts => {
  return new Promise( (resolve, reject) => {

    if( !opts.path ){
      return reject('config.queue.path not set!')
    }

    let batchSize = opts.batchSize || 25

    let batch = {
      inQueue : 0,
      inBatch : 0,
      files : [],
      data : [],
      response : {}
    }

    fs.readdir(opts.path, (err, files) => {
      batch.inQueue = files.length

      let fileBatch =  files.slice(0, batchSize)
      batch.inBatch = fileBatch.length

      fileBatch.forEach( file => {
        let path = opts.path + '/' + file
        let traits = getJSON( path )
        let id = traits.id
        if( !id ){
          return console.log('no id', traits)
        }
        delete traits.id

        batch.files.push(path)
        batch.data.push({ id, traits })
      })
      
      resolve( batch )

    })
  })
}

const cleanup = batch => {
  let files = batch.files
  files.forEach( file => {
    fs.unlink(file, err => {
      if( err ){
        console.log(err)
      }
    })
  })
}

module.exports = async ( config, opts ) => {

  let batch = await getBatch({
    path: config.queue.path,
    batchSize: opts.batch || config.queue.batchSize
  })

  if( !batch.data.length ){
    log('batch empty');
    return true;
  }

  let res = null
  let success = false
  if( opts.to && opts.to.match(/\.csv$/) ){
    res = await createCSV( batch.data, opts.to )
    success = !!res
  }
  else{
    let acc = config.account
    if (!acc.url) {
      console.log('missing account url')
      return false
    }

    let appKey = process.env[acc.appKey]
    let token = process.env[acc.token]

    if (!appKey || !token) {
      log(`Missing ${acc.appKey} or ${acc.token} in .env`)
      return false
    }
    
    let options = {
      baseURL : acc.url,
      appKey,
      token
    }

    if( opts.debug ){
      log({ batch : batch.data })
    }

    res = await cyapi(options).post('analytics/identify', batch.data )
    if( opts.debug ){
      log(res.data)
    }
    success = res.data && res.data.status === 'ok'
    if( success ){
      cleanup(batch)
    }
  }

  if( !success ){
    return false
  }

  delete batch.files
  batch.sample = batch.data.slice(0, 3)
  delete batch.data

  return batch
}