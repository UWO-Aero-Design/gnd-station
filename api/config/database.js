const { Client } = require('pg')

const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
})

const connect = () => {
    db.connect().then(() => {
        console.log(`Connected to database on port ${process.env.DB_PORT}`)
      })
      .catch(error => {
        console.log('Unable to connect to database')
        console.log(error)
      })
}

module.exports = {
    db,
    connect
}