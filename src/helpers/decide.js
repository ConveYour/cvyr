const ask = require('./ask')

module.exports = async ( question = '' ) => {
    let answer = await ask(`${question} (y/n)`)
    return answer === 'y'
}