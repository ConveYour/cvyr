const fs = require('fs')
const readline = require('readline');

module.exports = config => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question("y/n - Are you sure you want to clear the queue and queue cache?\n", answer => {
    
    if( answer !== 'y' ){
     console.log('OK will not clear queue')
     return rl.close()
    }
    
    console.log('TODO, clear cache!')
    
    rl.close();
  })

}