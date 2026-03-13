const {format, createLogger, transports} = require('winston')

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.errors({stack: true}),
        format.json()
    ),
    transports: [
        // Terminal
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        // Write to file
        new transports.File({filename: './logs/combined.log'})
    ]
})

module.exports = logger