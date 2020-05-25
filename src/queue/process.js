const fs = require('fs')
const axios = require('axios')

const getJSON = path => {
  try{
    let data = fs.readFileSync(path).toString()
    return JSON.parse( data )
  }
  catch( e ){
    return false
  }
}

const getBatch = config => {
  return new Promise( (resolve, reject) => {

    let q = config.queue
    if( !q.path ){
      return reject('config.queue.path not set!')
    }

    let batchSize = q.batchSize || 25

    let batch = {
      files : [],
      data : []
    }

    fs.readdir(q.path, (err, files) => {
      files.slice(0, batchSize).forEach( file => {
        let path = q.path + '/' + file
        let traits = getJSON( path )
        let id = traits.id
        if( !id ){
          return console.log('no id', traits)
        }
        delete traits.id

        console.log(traits)

        batch.files.push(path)
        batch.data.push({ id, traits })
      })
      
      resolve( batch )

    })
  })
}

const cleanup = batch => {
  batch.files.forEach( file => {
    fs.unlink(file, err => {
      if( err ){
        console.log(err)
      }
    })
  })
}

module.exports = async config => {

  let acc = config.account
  if( !acc.url ){
    console.log('missing account url')
    return false
  }

  let appKey = process.env[ acc.appKey ]
  let token = process.env[ acc.token ]

  if( !appKey || !token ){
    console.log(`Missing ${acc.appKey} or ${ acc.token } in .env`)
    return false
  }

  let batch = await getBatch( config )

  if( !batch.data.length ){
    console.log('batch is empty');
    return true;
  }

  axios({
    method : 'post',
    url : acc.url + '/api/analytics/identify',
    data : batch.data,
    headers: {
      'x-conveyour-appkey' : appKey,
      'x-conveyour-token' : token
    }
  })
  .then( res  => {
    console.log(res.data)
    if( res.data && res.data.status === 'ok'){
      cleanup(batch)
    }
  })

}