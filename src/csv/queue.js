const fieldMapper = require('./fieldMapper')
const csv = require('csv-parser')
const fs = require('fs')

module.exports = config => {
  let c = config.csv
  let mapper = fieldMapper(c.fieldMap)

  let file = c.fromFile
  let qPath = config.queue.path

  fs.createReadStream(file)
    .pipe( csv() )
    .on('data', data => {
     let reduced = {}
     mapper.forEach( m => {
       m(data, reduced)
     })

     id = reduced.id
     if( !id ){
       return console.log('no id', reduced);
     }

     let path = `${qPath}/${id}.json`
     console.log(`${path}`);
     fs.writeFileSync(path, JSON.stringify(reduced) ) 
    })
}