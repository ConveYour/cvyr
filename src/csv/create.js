const ObjectsToCsv = require('objects-to-csv');

module.exports = async (data, path ) => {

  data = data.map( r => r.traits )
  
  const csv = new ObjectsToCsv( data )
  
  return await csv.toDisk(path, {
    allColumns: true
  });
}