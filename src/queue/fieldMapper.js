module.exports = fieldMap => {
  let map = []
  for( let k in fieldMap ){
    let v = fieldMap[k]

    if( v === true ){
      map.push( ( data, reduced ) => {
        reduced[k] = data[k]
      })
    }

    else if( typeof v === 'function' ){
      map.push( (data, reduced) => {
        reduced[k] = v(data[k], data)
      })
    }
    else if( typeof v === 'string' ){
      map.push( (data, reduced) => {
        reduced[k] = data[v]
      })
    }
  }
  return map
}