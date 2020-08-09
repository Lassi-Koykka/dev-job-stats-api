const moment = require('moment')

const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} <${moment().format('ddd DD.MM.YYYY HH:mm:ss')}>`)
    console.log(`Parameters:`)
    console.log(req.query)
    next()
}

module.exports = logger