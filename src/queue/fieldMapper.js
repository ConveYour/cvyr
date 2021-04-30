module.exports = fieldMap => {
  let map = []
  for( let k in fieldMap ){
    let v = fieldMap[k]

    if( v === true ){
      map.push( ( data, reduced ) => {
        if( data[k] !== undefined ){
          reduced[k] = data[k]
        }
      })
    }

    else if( typeof v === 'function' ){
      map.push( (data, reduced) => {
        let compiled = v(data[k], data)
        if( compiled !== undefined ){
          reduced[k] = compiled
        }
        
      })
    }
    else if( typeof v === 'string' ){
      map.push( (data, reduced) => {
        if( data[v] !== undefined ){
          reduced[k] = data[v]
        }
      })
    }
  }
  return map
}