module.exports = msg => {
  if( typeof msg === 'object' ){
    msg = JSON.stringify(msg, null, 4);
  }
  
  console.log(msg)
}